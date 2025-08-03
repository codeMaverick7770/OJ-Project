const { createClient } = require("redis");
require("dotenv").config({ path: ".env.docker" });


const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const redisClient = createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      console.warn(`🔁 Redis reconnect attempt #${retries}`);
      return Math.min(retries * 100, 3000); // exponential backoff up to 3s
    },
  },
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error:", err.message);
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

redisClient.on("ready", () => {
  console.log("🟢 Redis ready to use");
});

redisClient.on("reconnecting", () => {
  console.log("🔄 Redis attempting to reconnect...");
});

(async () => {
  try {
    await redisClient.connect();
    console.log("🚀 Redis initial connection established");

    // 🧪 Health check every 60 seconds
    setInterval(async () => {
      try {
        await redisClient.ping();
        console.log("📶 Redis alive");
      } catch (err) {
        console.error("🚨 Redis unresponsive:", err.message);
      }
    }, 60000);
  } catch (err) {
    console.error("🚨 Initial Redis connection failed:", err.message);
  }
})();

module.exports = redisClient;
