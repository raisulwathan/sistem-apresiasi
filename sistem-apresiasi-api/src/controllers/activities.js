import ActivitiesService from '../services/ActivitiesService.js';
import { ActivityValidator } from '../validations/activities/index.js';

export const postActivityController = async (req, res) => {
  ActivityValidator.validatePostActivityPayload(req.body);

  const {
    userId,
    name,
    fieldActivity,
    activity,
    level,
    possitionAchievement,
    location,
    fileUrl,
  } = req.body;

  const activitiesService = new ActivitiesService();

  const newActivity = await activitiesService.addActivity({
    name,
    fieldActivity,
    activity,
    level,
    possitionAchievement,
    location,
    fileUrl,
    owner: userId,
  });

  res.status(201);
  res.json({
    status: 'success',
    message: 'kegiatan berhasil ditambahkan',
    data: {
      ...newActivity,
    },
  });
};
