import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './database/connection.js';
import authRoutes from './routes/authRoutes.js';
import pingRoutes from './routes/pingRoutes.js';
import problemRoutes from './routes/problemRoutes.js';

dotenv.config(); 
connectDB();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5178'],
  credentials: true
}));

app.use(express.json());

app.use('/api', pingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/problem', problemRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
