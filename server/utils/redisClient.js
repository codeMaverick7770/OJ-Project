// utils/redisClient.js
import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: 'localhost',  
    port: 6379       
  }
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));

await redisClient.connect();  
export default redisClient;
