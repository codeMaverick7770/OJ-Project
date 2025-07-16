import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function generateAiResponse({ code, level = 1, problem }) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const { title, description, solutionCode = {} } = problem || {};

    const basePrompt = `
You're a professional AI mentor for a DSA Online Judge platform.

Problem: ${title || 'Untitled'}
Description:
${description || 'No description'}

User's Code:
\`\`\`
${code}
\`\`\`
    `;

    const promptLevels = {
      1: `${basePrompt}\nGive a basic beginner-friendly HINT (no solution).`,
      2: `${basePrompt}\nGive another deeper HINT with logic clarifications.`,
      3: `${basePrompt}\nGive a logic breakdown or code snippet to help solve it.`,
      4: `${basePrompt}\nProvide the full solution (and optionally explain it):\n\nOfficial Solution:\n${solutionCode?.cpp || solutionCode?.java || solutionCode?.python || ''}`,
    };

    const prompt = promptLevels[level] || promptLevels[1];

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
