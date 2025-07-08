import express from 'express';
import { createSubmission } from '../controller/submissionController.js';

const router = express.Router();

router.post('/', createSubmission);

export default router;