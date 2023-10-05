import express from 'express';
import { tryCatch } from '../utils/index.js';
import { postAuthentication } from '../controllers/authentications.js';

const router = express.Router();

router.post('/', tryCatch(postAuthentication));

export default router;
