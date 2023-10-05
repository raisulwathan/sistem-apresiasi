import express from 'express';
import { postActivityController } from '../controllers/activities.js';
import { tryCatch } from '../utils/index.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/', authenticateToken, tryCatch(postActivityController));

export default router;
