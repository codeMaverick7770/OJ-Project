const { createClient } = require('redis');
require('dotenv').config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient = createClient({ url: REDIS_URL });

redisClient.on('error', (err) => console.error('🔴 Redis Error:', err));

(async () => {
  await redisClient.connect();
  console.log('🟢 Connected to Redis');
})();

module.exports = redisClient;
