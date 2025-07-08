import express from 'express';
import generateAiResponse from '../utils/genAiResponse.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { code } = req.body;

  if (!code || code.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Empty code! Please provide some code to review.'
    });
  }

  try {
    const aiResponse = await generateAiResponse(code);
    res.json({ success: true, aiResponse });
  } catch (error) {
    console.error('🔥 Gemini AI Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Something went wrong during AI review.'
    });
  }
});

export default router;
