import { AuthorizationError } from '../exceptions/AuthorizationError.js';
import ActivitiesService from '../services/ActivitiesService.js';
import UsersService from '../services/UsersService.js';
import { ActivityValidator } from '../validations/activities/index.js';

const activitiesService = new ActivitiesService();
const usersService = new UsersService();

export const postActivityController = async (req, res) => {
  ActivityValidator.validatePostActivityPayload(req.body);

  const userId = req.userId;
  const {
    name,
    fieldActivity,
    activity,
    level,
    possitionAchievement,
    location,
    years,
    fileUrl,
  } = req.body;

  const newActivity = await activitiesService.addActivity({
    name,
    fieldActivity,
    activity,
    level,
    possitionAchievement,
    location,
    years,
    fileUrl,
    owner: userId,
  });

  res.status(201);
  res.json({
    status: 'success',
    message: 'activity added',
    data: {
      ...newActivity,
    },
  });
};

export const getActivitiesController = async (req, res) => {
  const userId = req.userId;

  const activities = await activitiesService.getActivities(userId);

  res.json({
    status: 'success',
    data: {
      activities,
    },
  });
};

export const getActivityByIdController = async (req, res) => {
  const { id } = req.params;

  const activity = await activitiesService.getActivityById(id);

  res.json({
    status: 'success',
    data: {
      activity,
    },
  });
};

export const getActivitiesPointsController = async (req, res) => {
  const userId = req.userId;

  const points = await activitiesService.getActivityPoints(userId);

  res.json({
    status: 'success',
    data: {
      points,
    },
  });
};

export const putStatusActivityController = async (req, res) => {
  ActivityValidator.validatePutActivityPayload(req.body);

  const { userId, userRole } = req;
  const { id } = req.params;
  const { status, message } = req.body;

  if (userRole === 'BASIC') {
    throw new AuthorizationError('anda tidak berhak mengakses resources ini');
  }

  await activitiesService.verifyActivityAccess(userId, id);

  await activitiesService.editStatusActivityById(id, { status, message });

  res.json({
    status: 'success',
    message: 'kegiatan berhasil divalidasi',
  });
};

export const getRejectActivitiesController = async (req, res) => {
  const userId = req.userId;

  const rejectedActivities = await activitiesService.getRejectedActivities(
    userId
  );

  res.json({
    status: 'success',
    data: {
      rejectedActivities,
    },
  });
};

export const getRejectActivityByIdController = async (req, res) => {
  const { id } = req.params;

  const rejectedActivity = await activitiesService.getRejectedActivityById(id);

  res.json({
    status: 'success',
    data: {
      rejectedActivity,
    },
  });
};

export const getActivitiesByFacultyController = async (req, res) => {
  const { userId, userRole } = req;

  if (userRole === 'BASIC') {
    throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
  }

  const users = await usersService.getUserById(userId);

  const activities = await activitiesService.getActivitiesByFaculty(
    users.faculty
  );

  res.json({
    status: 'success',
    data: {
      activities,
    },
  });
};
