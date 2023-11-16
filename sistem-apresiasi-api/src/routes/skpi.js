import express from 'express';
import { tryCatch } from '../utils/index.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import {
  getSkpiByIdController,
  getSkpiController,
  postSkpiController,
  putStatusSkpiByIdController,
} from '../controllers/skpi.js';

const router = express.Router();

router.post('/', authenticateToken, tryCatch(postSkpiController));

router.get('/', authenticateToken, tryCatch(getSkpiController));
router.get('/:id', authenticateToken, tryCatch(getSkpiByIdController));
router.put(
  '/:id/validate',
  authenticateToken,
  tryCatch(putStatusSkpiByIdController)
);

export default router;
