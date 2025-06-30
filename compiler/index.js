const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp');

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5174', 
  credentials: true
}));
app.use(express.json());

app.post('/run', async (req, res) => {
  const { language = 'cpp', code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is empty' });

  try {
    const filePath = generateFile(language, code);
    const output = await executeCpp(filePath);
    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`🚀 Compiler server running on port ${PORT}`));
