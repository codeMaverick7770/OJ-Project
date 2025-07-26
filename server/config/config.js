import dotenv from 'dotenv';
dotenv.config({ path: '/home/ec2-user/OJ-Project/.env.production' });

export const JWT_SECRET = process.env.JWT_SECRET;
export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT || 8000;

console.log('🔍 MONGO_URI from config:', MONGO_URI);
