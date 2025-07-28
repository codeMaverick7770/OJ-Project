import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: 'localhost',
    port: 6379,
    reconnectStrategy: retries => Math.min(retries * 50, 2000) // Exponential backoff
  }
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));
redisClient.on('connect', () => console.log('✅ Redis connected'));
redisClient.on('reconnecting', () => console.log('♻️ Redis reconnecting...'));

await redisClient.connect();

export default redisClient;
