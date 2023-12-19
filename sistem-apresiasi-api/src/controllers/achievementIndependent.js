import { AuthorizationError } from '../exceptions/AuthorizationError.js';
import { InvariantError } from '../exceptions/InvariantError.js';
import AchievementIndependentService from '../services/AchievementIndependentService.js';
import UsersService from '../services/UsersService.js';
import { AchievementValidator } from '../validations/achievements/index.js';

const achievementIndependentService = new AchievementIndependentService();
const usersService = new UsersService();

export const postAchievementIndependentController = async (req, res) => {
  AchievementValidator.validatePostAchievementIndependentPayload(req.body);
  const {
    name,
    levelActivity,
    participantType,
    totalParticipants,
    participants,
    faculty,
    major,
    achievement,
    mentor,
    year,
    startDate,
    endDate,
    fileUrl,
  } = req.body;

  const users = await usersService.getUserById(req.userId);

  if (req.userRole === 'OPERATOR') {
    if (faculty !== users.faculty) {
      throw new InvariantError('cannot added achievement to other faculty');
    }
  }

  const newAchievement =
    await achievementIndependentService.addAchievementIndependent({
      name,
      levelActivity,
      participantType,
      totalParticipants,
      participants,
      faculty,
      major,
      achievement,
      mentor,
      year,
      startDate,
      endDate,
      fileUrl,
    });

  res.status(201).json({
    status: 'success',
    message: 'independent achievement added',
    data: {
      achievementId: newAchievement.id,
    },
  });
};

export const getAchievementIndependentController = async (req, res) => {
  if (req.userRole !== 'ADMIN' && req.userRole !== 'WR') {
    throw new AuthorizationError('Doesnt have right to access this resources');
  }
  const achievements =
    await achievementIndependentService.getAchievementIndependents();

  res.json({
    status: 'success',
    data: achievements,
  });
};

export const getAchievementIndependentByFacultyController = async (
  req,
  res
) => {
  const users = await usersService.getUserById(req.userId);
  const achievements =
    await achievementIndependentService.getAchievementIndependentByFaculty(
      users.faculty
    );

  res.json({
    status: 'success',
    data: achievements,
  });
};

export const getAchievementIndependentByIdController = async (req, res) => {
  const { id } = req.params;

  const achievement =
    await achievementIndependentService.getAchievementIndependentById(id);

  const users = await usersService.getUserById(req.userId);

  if (req.userRole === 'OPERATOR') {
    if (users.faculty !== achievement.faculty) {
      throw new AuthorizationError(
        'Doesnt have right to access this resources'
      );
    }
  }

  res.json({
    status: 'success',
    data: achievement,
  });
};

export const putAchievementIndependentByIdController = async (req, res) => {
  AchievementValidator.validatePutAchievementIndependentPayload(req.body);
  const { id } = req.params;
  const {
    name,
    levelActivity,
    participantType,
    totalParticipants,
    participants,
    faculty,
    major,
    achievement,
    mentor,
    year,
    startDate,
    endDate,
    fileUrl,
  } = req.body;

  const targetAchievement =
    await achievementIndependentService.getAchievementIndependentById(id);

  const users = await usersService.getUserById(req.userId);

  if (req.userRole === 'OPERATOR') {
    if (users.faculty !== targetAchievement.faculty) {
      throw new AuthorizationError(
        'Doesnt have right to access this resources'
      );
    }
  }

  const upadatedAchievement =
    await achievementIndependentService.putAchievementIndependent(id, {
      name,
      levelActivity,
      participantType,
      totalParticipants,
      participants,
      faculty,
      major,
      achievement,
      mentor,
      year,
      startDate,
      endDate,
      fileUrl,
    });

  res.json({
    status: 'success',
    message: 'Achievement updated',
    data: {
      achievementId: upadatedAchievement.id,
    },
  });
};

export const deleteAchievementIndependentByIdController = async (req, res) => {
  const { id } = req.params;

  const targetAchievement =
    await achievementIndependentService.getAchievementIndependentById(id);

  const users = await usersService.getUserById(req.userId);

  if (req.userRole === 'OPERATOR') {
    if (users.faculty !== targetAchievement.faculty) {
      throw new AuthorizationError(
        'Doesnt have right to access this resources'
      );
    }
  }

  await achievementIndependentService.deleteAchievementIndependentById(id);

  res.json({
    status: 'success',
    message: 'Achievement deleted',
  });
};
// Implementasi controller untuk metode-metode lainnya sesuai kebutuhan
