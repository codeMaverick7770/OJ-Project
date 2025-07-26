import dotenv from 'dotenv';
dotenv.config(); // will automatically load from .env in root directory

export const JWT_SECRET = process.env.JWT_SECRET;
export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT || 8000;

console.log('🔍 Loaded MONGO_URI:', MONGO_URI); // confirm loading
