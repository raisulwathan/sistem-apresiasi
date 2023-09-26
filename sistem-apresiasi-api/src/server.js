import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import activityRouter from './routes/activities.js';
import usersRouter from './routes/users.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.SERVER_PORT;

dotenv.config();

// middleware
app.use(express.json());
app.use(cors());

app.use('/activities', activityRouter);
app.use('/users', usersRouter);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Running on localhost:${PORT}`);
});
