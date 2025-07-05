import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function generateAiResponse(code) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You're a professional coding assistant on a DSA-focused Online Judge platform. 

Your job is to review the submitted code and provide a short, actionable feedback report. 

Guidelines:
1. Immediately highlight any syntax or logical errors.
2. Suggest improvements for clarity, formatting, or simplification.
3. Keep the review concise – no more than 5–7 lines.
4. Use bullet points if helpful. No unnecessary explanations.
5. If the code is correct, acknowledge that and offer 1–2 tips for improving code quality.

Here is the user's code:

\`\`\`
${code}
\`\`\`
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
