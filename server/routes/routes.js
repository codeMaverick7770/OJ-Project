import express from 'express';
const router = express.Router();
import { loginCode, registerCode } from '../controller/image-controller.js';

router.get("/login", loginCode);

router.get("/register", registerCode);

export default router;