import express from 'express';
import { updateLeaderboard, getLeaderboard } from '../controller/leaderboardController.js';

const router = express.Router();

router.post('/update', updateLeaderboard);
router.get('/', getLeaderboard); 

export default router;
