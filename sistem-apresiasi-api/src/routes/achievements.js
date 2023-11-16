import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { tryCatch } from '../utils/index.js';
import {
  getAchievementByIdController,
  getAchievementsController,
  postAchievementController,
} from '../controllers/achievements.js';

const router = express.Router();

router.post('/', authenticateToken, tryCatch(postAchievementController));
router.get('/', authenticateToken, tryCatch(getAchievementsController));
router.get('/:id', authenticateToken, tryCatch(getAchievementByIdController));

export default router;
