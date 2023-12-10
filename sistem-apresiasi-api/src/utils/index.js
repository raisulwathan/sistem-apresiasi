import fs from "fs";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { InvariantError } from "../exceptions/InvariantError.js";

export const loadData = (path) => {
  const fileBuffer = fs.readFileSync(path, "utf-8");
  const dataSkp = JSON.parse(fileBuffer);
  return dataSkp;
};

export const getBobotSKP = (data, { activity, level, possitionAchievement }) => {
  activity = activity.toLowerCase();
  level = level.toLowerCase();
  const matchActivity = data.bobotSkp.find((item) => item.kegiatan === activity);

  if (!matchActivity) {
    throw new NotFoundError("Kegiatan tidak ditemukan");
  }

  return matchActivity.tingkat
    ? possitionAchievement
      ? matchActivity.tingkat[level][possitionAchievement]
      : matchActivity.tingkat[level]
    : matchActivity.semuaLevel
    ? matchActivity.semuaLevel
    : new NotFoundError("tingkat kegiatan tidak ditemukan");
};

export const tryCatch = (controller) => async (req, res, next) => {
  try {
    await controller(req, res);
  } catch (error) {
    return next(error);
  }
};

export const verifyMinimumPoints = ({ mandatoryPoints, organizationPoints, scientificPoints, charityPoints, talentPoints, otherPoints }) => {
  if (!mandatoryPoints || mandatoryPoints < 20) {
    throw new InvariantError("Kegiatan Wajib harus memiliki minimal 20 skp");
  }

  if (organizationPoints === 0 && scientificPoints === 0 && charityPoints === 0 && talentPoints === 0 && otherPoints === 0) {
    throw new InvariantError("Minimal harus memiliki satu Kegiatan Pilihan.");
  }
};
