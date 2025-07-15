import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function generateSimplifiedText(prompt) {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-r1-0528:free',
        messages: [
          {
            role: 'user',
            content: `
You're a friendly coding mentor.

Explain the following coding problem in the simplest way possible so that even a beginner can understand it — without revealing the solution or giving away any implementation hints.

Keep the explanation short (under 2–3 paragraphs), easy to follow, and free from technical jargon.

Problem:
${prompt}
            `,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.VISUAL_AI_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'kickDSA',
        },
      }
    );

    return response.data.choices[0]?.message?.content || '⚠️ Explanation not found.';
  } catch (error) {
    console.error('[OpenRouter Error]', error?.response?.data || error.message);
    return '⚠️ Simplified explanation not available.';
  }
}

export const simplifyWithVisual = async (req, res) => {
  const { prompt } = req.body;

  try {
    const explanation = await generateSimplifiedText(prompt);
    res.json({ explanation });
  } catch (error) {
    console.error('[Simplify Error]', error?.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to generate simplified explanation',
      details: error?.response?.data || error.message,
    });
  }
};
