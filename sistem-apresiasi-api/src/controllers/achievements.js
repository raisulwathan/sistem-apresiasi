import { AuthorizationError } from '../exceptions/AuthorizationError.js';
import AchievementsService from '../services/AchievementsService.js';
import ActivitiesService from '../services/ActivitiesService.js';
import UsersService from '../services/UsersService.js';
import { AchievementValidator } from '../validations/achievements/index.js';

export const postAchievementController = async (req, res) => {
  AchievementValidator.validatePostAchievementPayload(req.body);

  const { userId, userRole } = req;
  const { activityId, ownerId } = req.body;
  const achievementsService = new AchievementsService();
  const activitiesService = new ActivitiesService();

  if (userRole === 'BASIC') {
    throw new AuthorizationError(
      'Users doesnt not have right to access resources'
    );
  }

  await activitiesService.verifyActivityAccess(userId, activityId);
  await achievementsService.verifyAvailableActivityId(activityId);

  const achievement = await achievementsService.addAchievement({
    activityId,
    ownerId,
  });

  res.status(201);
  res.json({
    status: 'success',
    message: 'Achievement added',
    data: {
      achievement,
    },
  });
};

export const getAchievementsController = async (req, res) => {
  const { userRole, userId } = req;
  const achievementsService = new AchievementsService();
  const usersService = new UsersService();

  if (userRole === 'BASIC') {
    throw new AuthorizationError(
      'Users doesnt not have right to access resources'
    );
  }

  if (userRole === 'OPERATOR' || userRole === 'WD') {
    const users = await usersService.getUserById(userId);
    const achievements = await achievementsService.getAchievementByFaculty(
      users.faculty
    );

    return res.json({
      status: 'success',
      data: {
        achievements,
      },
    });
  }

  const achievements = await achievementsService.getAchievements();

  res.json({
    status: 'success',
    data: {
      achievements,
    },
  });
};

export const getAchievementByIdController = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const achievementsService = new AchievementsService();

  await achievementsService.verifyAchievementAccess(userId, id);
  const achievement = await achievementsService.getAchievementById(id);

  res.json({
    status: 'success',
    data: {
      achievement,
    },
  });
};
