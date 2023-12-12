import { AuthorizationError } from '../exceptions/AuthorizationError.js';
import { InvariantError } from '../exceptions/InvariantError.js';
import UsersService from '../services/UsersService.js';
import { AchievementValidator } from '../validations/achievements/index.js';
import AchievementNonCompetitionService from '../services/AchievementNonCompetitionService.js';

const achievementNonCompetitionService = new AchievementNonCompetitionService();
const usersService = new UsersService();

export const postAchievementNonCompetitionController = async (req, res) => {
  AchievementValidator.validatePostAchievementNonCompetitionPayload(req.body);
  const { name, category, faculty, activity, numberOfStudents, year, fileUrl } =
    req.body;

  const users = await usersService.getUserById(req.userId);

  if (req.userRole === 'OPERATOR') {
    if (faculty !== users.faculty) {
      throw new InvariantError('cannot added achievement to other faculty');
    }
  }

  const newAchievement =
    await achievementNonCompetitionService.addAchievementNonCompetition({
      name,
      category,
      faculty,
      activity,
      numberOfStudents,
      year,
      fileUrl,
    });

  res.status(201).json({
    status: 'success',
    message: 'achievement added',
    data: {
      achievementId: newAchievement.id,
    },
  });
};

export const getAchievementNonCompetitionsController = async (req, res) => {
  if (req.userRole !== 'ADMIN') {
    throw new AuthorizationError('Doesnt have right to access this resources');
  }

  const achivements =
    await achievementNonCompetitionService.getAchievementNonCompetitions();

  res.json({
    status: 'success',
    data: achivements,
  });
};

export const getAchievementNonCompetitionsByFacultyController = async (
  req,
  res
) => {
  const users = await usersService.getUserById(req.userId);

  const achievements =
    await achievementNonCompetitionService.getAchievementNonCompetitionsByFaculty(
      users.faculty
    );

  res.json({
    status: 'success',
    data: achievements,
  });
};

export const getAchievementNonCompetitionByIdController = async (req, res) => {
  const { id } = req.params;

  const achievement =
    await achievementNonCompetitionService.getAchievementNonCompetitionById(id);
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

export const putAchievementNonCompetitionByIdController = async (req, res) => {
  AchievementValidator.validatePutAchievementNonCompetitionPayload;
  const { id } = req.params;
  const { name, category, faculty, activity, numberOfStudents, year, fileUrl } =
    req.body;

  const achievement =
    await achievementNonCompetitionService.getAchievementNonCompetitionById(id);
  const users = await usersService.getUserById(req.userId);

  if (req.userRole === 'OPERATOR') {
    if (users.faculty !== achievement.faculty) {
      throw new AuthorizationError(
        'Doesnt have right to access this resources'
      );
    }
  }

  const updatedAchievement =
    await achievementNonCompetitionService.editAchievementNonCompetitionById(
      id,
      {
        name,
        category,
        faculty,
        activity,
        numberOfStudents,
        year,
        fileUrl,
      }
    );

  res.json({
    status: 'success',
    message: 'Achievement is updated',
    data: {
      achievementId: updatedAchievement.id,
    },
  });
};

export const deleteAchievementNonCompetitionByIdController = async (
  req,
  res
) => {
  const { id } = req.params;

  const achievement =
    await achievementNonCompetitionService.getAchievementNonCompetitionById(id);
  const users = await usersService.getUserById(req.userId);

  if (req.userRole === 'OPERATOR') {
    if (users.faculty !== achievement.faculty) {
      throw new AuthorizationError(
        'Doesnt have right to access this resources'
      );
    }
  }

  await achievementNonCompetitionService.deleteAchievementNonCompetitionById(
    id
  );

  res.json({
    status: 'success',
    message: 'Achievement deleted',
  });
};
