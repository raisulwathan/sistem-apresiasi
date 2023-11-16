import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import activityRouter from './routes/activities.js';
import usersRouter from './routes/users.js';
import authRouter from './routes/authentications.js';
import skpiRouter from './routes/skpi.js';
import achievementRouter from './routes/achievements.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.SERVER_PORT;

dotenv.config();

// middleware
app.use(express.json());
app.use(cors());

// api handler
app.use('/api/v1/activities', activityRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/authentications', authRouter);
app.use('/api/v1/skpi', skpiRouter);
app.use('/api/v1/achievements', achievementRouter);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Running on localhost:${PORT}`);
});
