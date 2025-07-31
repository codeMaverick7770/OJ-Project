import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    reconnectStrategy: retries => Math.min(retries * 50, 2000),
  },
});

redisClient.on('error', err => console.error('❌ Redis Client Error:', err));
redisClient.on('connect', () => console.log('✅ Redis connected'));
redisClient.on('reconnecting', () => console.log('♻️ Redis reconnecting...'));

await redisClient.connect();

export default redisClient;
