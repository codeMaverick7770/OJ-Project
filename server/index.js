import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './database/connection.js';
import authRoutes from './routes/authRoutes.js';
import pingRoutes from './routes/pingRoutes.js';

dotenv.config();
connectDB();

const app = express(); // ✅ Move this ABOVE all app.use

// Enable CORS with frontend origin
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5178'], // ✅ Allow both (or just 5178)
  credentials: true
}));


app.use(express.json());

app.use('/api', pingRoutes); // ✅ This is now after app is defined
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
