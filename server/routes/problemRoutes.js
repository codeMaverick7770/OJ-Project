import express from 'express';
import {
  createProblem,
  getAllProblems,
  getSingleProblem,
  deleteProblem
} from '../controller/problemController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin
router.post('/create', verifyToken, createProblem);
router.delete('/:id', verifyToken, deleteProblem);

// Public
router.get('/', getAllProblems);
router.get('/:id', getSingleProblem);

export default router;
