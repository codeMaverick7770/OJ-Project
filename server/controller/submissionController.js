import User from '../models/user.js';
import axios from 'axios';

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

    user.submissionCount = (user.submissionCount || 0) + 1;
    await user.save();

    // Here you might want to add logic to evaluate the submission
    // For example, running tests, checking correctness, etc.
    // This is just a placeholder for where that logic would go
    const submissionResult = await evaluateSubmission(code, language, problemId);

    // Send the response before updating the leaderboard
    res.status(201).json({ 
      success: true, 
      message: 'Submission successful',
      result: submissionResult
    });

    // 🔄 Fire-and-forget leaderboard update
    try {
      await axios.post('http://localhost:8000/api/leaderboard/update', {
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

// Placeholder function for submission evaluation
async function evaluateSubmission(code, language, problemId) {
  // This function should contain the logic to run the code against test cases
  // and determine if the submission is correct
  // For now, we'll just return a placeholder result
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

// Add more submission-related controller functions as needed