const amqp = require("amqplib");

let channel;
const queueName = "code_submissions"; // centralized

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://rabbitmq");
    channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    console.log("✅ Connected to RabbitMQ & Queue:", queueName);
  } catch (err) {
    console.error("❌ Failed to connect to RabbitMQ:", err.message);
    process.exit(1);
  }
};

const sendToQueue = async (data) => {
  if (!channel) {
    console.error("❌ Cannot send job: RabbitMQ channel not initialized");
    throw new Error("RabbitMQ channel not ready");
  }

  console.log("📤 Publishing job to queue:", data);
  const success = channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
    persistent: true,
  });

  if (!success) {
    console.warn("⚠️ Job could not be queued (sendToQueue returned false)");
  }
};

module.exports = {
  connectRabbitMQ,
  sendToQueue,
};
