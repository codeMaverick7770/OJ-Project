import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '/home/ec2-user/OJ-Project/.env.production' }); 

console.log('🔍 Loaded MONGO_URI:', process.env.MONGO_URI);

export const JWT_SECRET = process.env.JWT_SECRET;
export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT || 8000;
