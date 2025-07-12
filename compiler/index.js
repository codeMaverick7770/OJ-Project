const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp');
const { executePython } = require('./executePython');
const { executeJava } = require('./executeJava');
const { generateInputFile } = require('./generateInputFile');

dotenv.config();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://localhost:','https://kickdsa.online', 'https://www.kickdsa.online')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// 🔧 Run Code Endpoint
app.post('/run', async (req, res) => {
  const { language = 'cpp', code, input = '' } = req.body;

  if (!code) return res.status(400).json({ error: 'Code is empty' });

  try {
    const filePath = generateFile(language, code);
    const inputPath = generateInputFile(input);

    let output;

    switch (language) {
      case 'cpp':
        output = await executeCpp(filePath, inputPath);
        break;
      case 'python':
        output = await executePython(filePath, inputPath);
        break;
      case 'java':
        output = await executeJava(filePath, inputPath);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported language' });
    }

    res.json({ output });
  } catch (err) {
    console.error("Run error:", err);
    res.status(500).json({ error: err });
  }
});

require('./cleanup');
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`🚀 Compiler server running on port ${PORT}`));
