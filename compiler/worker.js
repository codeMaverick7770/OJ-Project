const fs = require("fs");
const amqp = require("amqplib");
const redisClient = require("./redisClient");
const { executeCpp } = require("./executeCpp");
const { executeJavascript } = require("./executeJavascript");
const { executePython } = require("./executePython");
const { executeJava } = require("./executeJava");
const { generateFile } = require("./generateFile");
const { generateInputFile } = require("./generateInputFile");
require("dotenv").config();
require("./cleanup");

const queueName = "code_submissions";
const EXECUTION_TIMEOUT_MS = 5000;

async function connectWorker() {
  try {
    const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq";
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    console.log("🔧 Worker is listening for jobs...");

    channel.consume(
      queueName,
      async (msg) => {
        if (!msg) return;

        const job = JSON.parse(msg.content.toString());
        const { id, language, code, input } = job;
        console.log("📥 Received job:", id, "| Language:", language);

        try {
          await redisClient.set(id, JSON.stringify({ status: "started" }));

          const codeFilePath = generateFile(language, code, id);
          const inputFilePath = generateInputFile(input, id);
          if (!fs.existsSync(codeFilePath)) {
            throw new Error(`Code file not found: ${codeFilePath}`);
          }
          if (!fs.existsSync(inputFilePath)) {
            throw new Error(`Input file not found: ${inputFilePath}`);
          }

          const executorMap = {
            cpp: executeCpp,
            js: executeJavascript,
            javascript: executeJavascript,
            py: executePython,
            python: executePython,
            java: executeJava,
          };

          const executor = executorMap[language.toLowerCase()];
          if (!executor) throw new Error(`Unsupported language: ${language}`);

          const output = await Promise.race([
            executor(codeFilePath, inputFilePath),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("Time Limit Exceeded")),
                EXECUTION_TIMEOUT_MS
              )
            ),
          ]);

          await redisClient.set(
            id,
            JSON.stringify({ status: "completed", output })
          );
          console.log("✅ Job completed:", id);
        } catch (err) {
          console.error("❌ Execution error for job", id, ":", err);
          const stderr = err.stderr || err.message || "";
          let errorType = "Unknown";

          if (err.message === "Time Limit Exceeded") {
            errorType = "TLE";
          } else if (
            /std::bad_alloc|cannot allocate memory|ENOMEM/i.test(stderr)
          ) {
            errorType = "Memory Limit Exceeded";
          } else if (/Segmentation fault|SIGSEGV/i.test(stderr)) {
            errorType = "Runtime Error";
          } else if (/error:/i.test(stderr)) {
            errorType = "Compilation Error";
          } else if (stderr) {
            errorType = "Runtime Error";
          }

          await redisClient.set(
            id,
            JSON.stringify({
              status: "error",
              errorType,
              error: stderr || "Unknown error",
            })
          );
        } finally {
          channel.ack(msg);
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.error("❌ Worker failed to connect:", err.message);
    process.exit(1);
  }
}

connectWorker();
