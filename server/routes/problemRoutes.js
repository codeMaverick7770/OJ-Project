import express from 'express';
import {
  createProblem,
  getAllProblems,
  getSingleProblem,
  deleteProblem,
  bulkCreateProblems,
  updateProblem,
} from '../controller/problemController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { verifyAdmin } from '../middleware/admin.js';

const router = express.Router();

// Admin Only
router.post('/create', verifyToken, verifyAdmin, createProblem);
router.post('/bulk', verifyToken, verifyAdmin, bulkCreateProblems);
router.put('/:id', verifyToken, verifyAdmin, updateProblem);
router.delete('/:id', verifyToken, verifyAdmin, deleteProblem);

// Public
router.get('/', getAllProblems);
router.get('/:id', getSingleProblem);

export default router;
