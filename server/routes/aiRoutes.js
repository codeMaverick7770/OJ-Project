import express from 'express';
import generateAiResponse from '../utils/genAiResponse.js';
import Problem from '../models/problem.js'; 

const router = express.Router();

router.post('/', async (req, res) => {
  const { code, level, problemId } = req.body;

  if (!code || code.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Empty code! Please provide some code to review.',
    });
  }

  try {
    let problem = null;

    // If it's a multilevel request, fetch the full problem
    if (level && problemId) {
      problem = await Problem.findById(problemId);
      if (!problem) {
        return res.status(404).json({ success: false, error: 'Problem not found.' });
      }
    }

    const aiResponse = await generateAiResponse({ code, level, problem });
    res.json({ success: true, aiResponse });
  } catch (error) {
    console.error('🔥 Gemini AI Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Something went wrong during AI review.',
    });
  }
});

export default router;
