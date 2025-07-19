import express from 'express';
import User from '../models/user.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/user/dashboard-stats
// @access  Private
router.get('/dashboard-stats', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // assuming decoded token contains `id`
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const allUsers = await User.find().sort({ score: -1 });

    const rank = allUsers.findIndex(u => u._id.toString() === user._id.toString()) + 1;

    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      solvedCount: user.solvedProblems?.length || 0,
      submissionCount: user.submissionCount || 0,
      rank: rank
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Error fetching dashboard data' });
  }
});

export default router;
