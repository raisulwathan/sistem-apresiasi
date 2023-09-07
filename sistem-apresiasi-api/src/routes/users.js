import express from 'express';
import { postUsersController } from '../controllers/users.js';

const router = express.Router();

router.post('/', postUsersController);

export default router;
