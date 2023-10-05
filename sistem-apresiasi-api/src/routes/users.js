import express from 'express';
import {
  getUserByIdController,
  postUsersController,
  putUsersByIdController,
} from '../controllers/users.js';
import { tryCatch } from '../utils/index.js';

const router = express.Router();

router.post('/', tryCatch(postUsersController));
router.get('/:id', tryCatch(getUserByIdController));
router.put('/:id', tryCatch(putUsersByIdController));

export default router;
