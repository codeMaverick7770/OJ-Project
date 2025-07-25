import express from 'express';
import {
  createProblem,
  getAllProblems,
  getSingleProblem,
  deleteProblem,
  bulkCreateProblems,
} from '../controller/problemController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { verifyAdmin } from '../middleware/admin.js'; // ✅ import admin check

const router = express.Router();

// Admin Only
router.post('/create', verifyToken, verifyAdmin, createProblem);  // ✅ admin protected
router.post('/bulk', verifyToken, verifyAdmin, bulkCreateProblems); // ✅ admin protected
router.delete('/:id', verifyToken, verifyAdmin, deleteProblem);    // ✅ admin protected

// New Route: Bulk Create Problems
router.post('/bulk', verifyToken, verifyAdmin, bulkCreateProblems); // ✅ new route


// Public
router.get('/', getAllProblems);
router.get('/:id', getSingleProblem);

export default router;
