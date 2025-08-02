import '../loadEnv.js';
import './config/config.js';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import { connectDB } from './database/connection.js';

import './config/passport.js'; 

import authRoutes from './routes/authRoutes.js';
import pingRoutes from './routes/pingRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import leaderboardRoutes from './routes/leaderboard.js';
import submissionRoutes from './routes/submissionRoutes.js';
import { PORT } from './config/config.js';
import aiVisualRoutes from './routes/aiVisualRoutes.js';
import userRoutes from './routes/userRoutes.js';

connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://kickdsa.online',
    'https://www.kickdsa.online',
    'https://backend.kickdsa.online',
    'https://www.backend.kickdsa.online',
    'https://compiler.kickdsa.online',
    'https://www.compiler.kickdsa.online'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());


app.use(passport.initialize());


app.use('/api', pingRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/problem', problemRoutes);
app.use('/api/ai-review', aiRoutes); 
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/visual-ai', aiVisualRoutes);
app.use('/api/user', userRoutes);

console.log('✅ Loading authRoutes:', typeof authRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
