import ActivitiesService from '../services/ActivitiesService.js';

export const postActivity = async (req, res) => {
  const {
    userId,
    name,
    fieldActivity,
    activity,
    level,
    possitionAchievement,
    year,
    location,
    fileUrl,
  } = req.body;

  const activitiesService = new ActivitiesService();

  try {
    const newActivity = await activitiesService.addActivity({
      name,
      fieldActivity,
      activity,
      level,
      possitionAchievement,
      year,
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
  } catch (error) {
    res.status(400);
    res.json({
      status: 'fail',
      message: error.message,
    });
  }
};
