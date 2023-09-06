import express from 'express';
import dotenv from 'dotenv';
import bobotSkp from './services/bobotSkp.js';
import { loadData } from './utils/index.js';

dotenv.config();
const app = express();
const PORT = process.env.SERVER_PORT;

// middleware
app.use(express.json());

app.get('/activities', (req, res) => {
  const { category, activity, level, detail } = req.body;

  try {
    const path = `./src/data/${category}.json`;
    const data = loadData(path);
    const points = bobotSkp(data, { activity, level, detail });

    res.json({
      status: 'success',
      data: {
        category,
        activity,
        level,
        detail,
        points,
      },
    });
  } catch (error) {
    res.status(400);
    res.json({
      status: 'fail',
      message: error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Running on localhost:${PORT}`);
});
