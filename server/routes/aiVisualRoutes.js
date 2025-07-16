import express from 'express';
import { simplifyWithVisual } from '../controller/aiVisualController.js';

const router = express.Router();

router.post('/simplify', simplifyWithVisual);

export default router;
