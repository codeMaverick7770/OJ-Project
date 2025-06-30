const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp');
const { executePython } = require('./executePython');
const { executeJava } = require('./executeJava');

dotenv.config();

const app = express();
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

app.post('/run', async (req, res) => {
  const { language = 'cpp', code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is empty' });

  try {
    const filePath = generateFile(language, code);
    let output;

    switch (language) {
      case 'cpp':
        output = await executeCpp(filePath);
        break;
      case 'python':
        output = await executePython(filePath);
        break;
      case 'java':
        output = await executeJava(filePath);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported language' });
    }

    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`🚀 Compiler server running on port ${PORT}`));
