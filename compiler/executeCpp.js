const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

const sanitize = (str) => path.basename(str);

const executeCpp = (filepath, inputPath) => {
  const jobId = sanitize(filepath).split(".")[0];
  const containerName = `cpp-${jobId}`;
  const codeFileName = sanitize(filepath);
  const inputFileName = sanitize(inputPath);

  return new Promise((resolve, reject) => {
    const command = `
      docker run --rm --name=${containerName} \
      --cpus="0.5" --memory="128m" --network=none \
      -v ${filepath}:/app/${codeFileName}:ro \
      -v ${inputPath}:/app/${inputFileName}:ro \
      code-runner bash -c "g++ /app/${codeFileName} -o /app/a.out && timeout 4s /app/a.out < /app/${inputFileName}"
    `;

    exec(command, { timeout: 7000 }, (error, stdout, stderr) => {
      if (error) return reject({ error, stderr });
      if (stderr) return reject({ stderr });
      resolve(stdout);
    });
  });
};

module.exports = { executeCpp };
