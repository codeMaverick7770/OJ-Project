import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy: retries => {
      console.warn(`🔁 Redis reconnect attempt #${retries}`);
      return Math.min(retries * 100, 3000); // retry with backoff
    },
  },
});

redisClient.on('error', err => {
  console.error('❌ Redis Client Error:', err.message);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

redisClient.on('ready', () => {
  console.log('🟢 Redis ready');
});

redisClient.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...');
});

const connectWithRetry = async (retries = 5) => {
  while (retries > 0) {
    try {
      await redisClient.connect();
      console.log('🚀 Redis connection established');
      return redisClient;
    } catch (err) {
      console.error(`⏳ Redis connection failed: ${err.message}`);
      retries--;
      await new Promise(res => setTimeout(res, 3000));
    }
  }
  throw new Error('❌ Redis not reachable after multiple attempts');
};

await connectWithRetry();

process.on('SIGINT', async () => {
  await redisClient.quit();
  console.log('👋 Redis client closed');
  process.exit(0);
});

export default redisClient;
