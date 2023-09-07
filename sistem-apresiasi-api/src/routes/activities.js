import express from 'express';
import { postActivity } from '../controllers/activities.js';

const router = express.Router();

router.post('/', postActivity);

export default router;
