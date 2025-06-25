// server/routes/pingRoutes.js
import express from 'express';
const router = express.Router();

router.get('/ping', (req, res) => {
  res.json({ message: 'Pong from backend!' });
});

export default router;
