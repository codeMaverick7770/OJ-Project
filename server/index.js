import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './database/connection.js';
import authRoutes from './routes/authRoutes.js';
import pingRoutes from './routes/pingRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import leaderboardRoutes from './routes/leaderboard.js';
import submissionRoutes from './routes/submissionRoutes.js';
import { verifyAdmin } from './middleware/admin.js';

dotenv.config(); 
connectDB();

const app = express();
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://localhost:','https://kickdsa.online', 'https://www.kickdsa.online')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api', pingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/problem', problemRoutes);
app.use('/api/ai-review', aiRoutes); 
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/submissions', submissionRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
