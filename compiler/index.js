const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const amqp = require('amqplib');
const redisClient = require('./redisClient');
require('./cleanup');
const { formatCode } = require('./utils/format');

dotenv.config();

const app = express();
app.use(express.json());

// 🌐 CORS Setup
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://kickdsa.online',
      'https://www.kickdsa.online',
      'https://backend.kickdsa.online',
      'https://www.backend.kickdsa.online',
      'https://compiler.kickdsa.online',
      'https://www.compiler.kickdsa.online',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 🐰 RabbitMQ Connection Setup
let channel, connection;
const queueName = 'code_submissions';

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    console.log('📡 Connected to RabbitMQ');
  } catch (err) {
    console.error('❌ RabbitMQ connection error:', err.message);
  }
}

connectRabbitMQ(); // Call on startup

// 🟡 POST /run → Queue job
app.post('/run', async (req, res) => {
  const { language = 'cpp', code, input = '' } = req.body;

  if (!code) return res.status(400).json({ error: 'Code is empty' });

  const submissionId = uuidv4();
  const payload = { id: submissionId, language, code, input };

  try {
    // Send job to queue
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
    });

    // Set initial status to Redis
    await redisClient.set(submissionId, JSON.stringify({ status: 'queued' }));

    console.log('📨 Job queued:', submissionId);
    return res.status(202).json({ jobId: submissionId }); // ✅ changed line
  } catch (err) {
    console.error('🚨 Failed to queue job:', err.message);
    return res.status(500).json({ error: 'Failed to queue the job' });
  }
});

// 🟢 GET /status/:submissionId → Fetch result/status
// 🟢 GET /run/status/:submissionId → Fetch result/status
app.get('/run/status/:submissionId', async (req, res) => {
  const { submissionId } = req.params;

  try {
    const result = await redisClient.get(submissionId);

    if (!result) {
      return res.status(202).json({ status: 'pending' });
    }

    return res.status(200).json(JSON.parse(result));
  } catch (err) {
    console.error('❌ Redis fetch error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch job status' });
  }
});

app.post('/run/format', async (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: 'Language and code are required' });
  }

  try {
    const formattedCode = await formatCode(language, code);
    if (!formattedCode) {
      return res.status(500).json({ error: 'Unable to format code' });
    }
    return res.status(200).json({ formattedCode });
  } catch (error) {
    console.error('🛠️ Formatting error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error during formatting' });
  }
});



// 🚀 Start server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`🚀 Compiler server running on port ${PORT}`);
});
