import fs from 'fs';

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
    throw new Error('Kegiatan tidak ditemukan');
  }

  return matchActivity.tingkat
    ? possitionAchievement
      ? matchActivity.tingkat[level][possitionAchievement]
      : matchActivity.tingkat[level]
    : matchActivity.semuaLevel
    ? matchActivity.semuaLevel
    : new Error('tingkat kegiatan tidak ditemukan');
};
