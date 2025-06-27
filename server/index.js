import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './database/connection.js';
import authRoutes from './routes/authRoutes.js';
import pingRoutes from './routes/pingRoutes.js';
import problemRoutes from './routes/problemRoutes.js'; // ✅ Import new route

dotenv.config();
connectDB();

const app = express();

// ✅ Allow CORS from both frontend ports
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5178'],
  credentials: true
}));

app.use(express.json());

// ✅ Register routes
app.use('/api', pingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/problem', problemRoutes); // ✅ New problem route

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
