// utils/redisClient.js
import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: 'localhost',  // or '127.0.0.1'
    port: 6380          // since your docker mapped 6380 -> 6379
  }
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));

await redisClient.connect();  // Top-level await is allowed in ESM

export default redisClient;
