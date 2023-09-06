import fs from 'fs';

export const loadData = (path) => {
  const fileBuffer = fs.readFileSync(path, 'utf-8');
  const dataSkp = JSON.parse(fileBuffer);
  return dataSkp;
};
