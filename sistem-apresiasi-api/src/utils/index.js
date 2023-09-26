import fs from 'fs';
import { NotFoundError } from '../exceptions/NotFoundError.js';

export const loadData = (path) => {
  const fileBuffer = fs.readFileSync(path, 'utf-8');
  const dataSkp = JSON.parse(fileBuffer);
  return dataSkp;
};

export const getBobotSKP = (
  data,
  { activity, level, possitionAchievement }
) => {
  const matchActivity = data.bobotSkp.find(
    (item) => item.kegiatan === activity
  );

  if (!matchActivity) {
    throw new NotFoundError('Kegiatan tidak ditemukan');
  }

  return matchActivity.tingkat
    ? possitionAchievement
      ? matchActivity.tingkat[level][possitionAchievement]
      : matchActivity.tingkat[level]
    : matchActivity.semuaLevel
    ? matchActivity.semuaLevel
    : new NotFoundError('tingkat kegiatan tidak ditemukan');
};

export const tryCatch = (controller) => async (req, res, next) => {
  try {
    await controller(req, res);
  } catch (error) {
    return next(error);
  }
};
