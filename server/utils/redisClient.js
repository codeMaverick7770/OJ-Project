import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  socket: {
    reconnectStrategy: retries => Math.min(retries * 50, 2000),
  },
});

redisClient.on('error', err => console.error('❌ Redis Client Error:', err));
redisClient.on('connect', () => console.log('✅ Redis connected'));
redisClient.on('reconnecting', () => console.log('♻️ Redis reconnecting...'));

const connectWithRetry = async (retries = 5) => {
  while (retries) {
    try {
      await redisClient.connect();
      console.log('✅ Connected to Redis');
      return redisClient;
    } catch (err) {
      console.error('⏳ Redis connection failed, retrying in 3s...');
      retries--;
      await new Promise(res => setTimeout(res, 3000));
    }
  }
  throw new Error('❌ Could not connect to Redis after retries');
};

await connectWithRetry();
export default redisClient;
