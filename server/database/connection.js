// connectDB.js
import mongoose from 'mongoose';
import { MONGO_URI } from '../config/config.js';

export const connectDB = async () => {
  try {
    console.log('🧪 MONGO_URI from config:', MONGO_URI); // <--- debug
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.log('❌ DB connection failed:', error.message);
    process.exit(1);
  }
};
