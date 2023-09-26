import express from 'express';
import { postActivityController } from '../controllers/activities.js';
import { tryCatch } from '../utils/index.js';

const router = express.Router();

router.post('/', tryCatch(postActivityController));

export default router;
