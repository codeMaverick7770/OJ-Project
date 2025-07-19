import User from '../models/user.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Load VITE_API_BASE_URL from .env

export const createSubmission = async (req, res) => {
  try {
    console.log("Received submission data:", req.body);
    const { userId, problemId, code, language } = req.body;

    if (!userId || !problemId || !code || !language) {
      console.log("Missing required fields:", { userId, problemId, code, language });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ error: 'User not found' });
    }


    const submissionResult = await evaluateSubmission(code, language, problemId);

    // Send response first
    res.status(201).json({
      success: true,
      message: 'Submission successful',
      result: submissionResult
    });

    // 🔄 Fire-and-forget leaderboard update
    try {
      await axios.post(`${process.env.VITE_API_BASE_URL}/leaderboard/update`, {
        userId,
        problemId
      });
      console.log("Leaderboard update successful");
    } catch (err) {
      console.error("Leaderboard update failed:", err?.response?.data || err.message);
    }

  } catch (err) {
    console.error("Error creating submission:", err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

// Placeholder submission evaluator
async function evaluateSubmission(code, language, problemId) {
  return {
    passed: true,
    score: 100,
    executionTime: '0.5s'
  };
}

export const getSubmissions = async (req, res) => {
  try {
    const { userId } = req.params;
    const submissions = await Submission.find({ userId }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};
