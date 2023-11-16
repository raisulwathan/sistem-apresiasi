import { PrismaClient } from '@prisma/client';
import { InvariantError } from '../exceptions/InvariantError.js';
import { NotFoundError } from '../exceptions/NotFoundError.js';
import UsersService from './UsersService.js';
import { AuthorizationError } from '../exceptions/AuthorizationError.js';

class AchievementsService {
  constructor() {
    this._prisma = new PrismaClient();
    this._usersService = new UsersService();
  }

  async addAchievement({ activityId, ownerId }) {
    const addedAchievement = await this._prisma.achievement.create({
      data: {
        activityId,
        ownerId,
      },
    });

    if (!addedAchievement) {
      throw new InvariantError('failed to add new Achievement');
    }

    return {
      achievementId: addedAchievement.id,
      userId: addedAchievement.ownerId,
    };
  }

  async getAchievements() {
    const achievements = await this._prisma.achievement.findMany({
      select: {
        id: true,
        activity: {
          select: {
            name: true,
            fieldsActivity: true,
            levels: true,
            years: true,
          },
        },
        owner: {
          select: {
            npm: true,
            name: true,
          },
        },
      },
    });

    if (!achievements) {
      throw new NotFoundError('Achievements not found');
    }

    return achievements;
  }

  async getAchievementById(id) {
    const achievement = await this._prisma.achievement.findUnique({
      select: {
        activity: true,
        owner: true,
      },
      where: {
        id,
      },
    });

    if (!achievement) {
      throw new NotFoundError('Acheivement not found. id is invalid');
    }

    return achievement;
  }

  async getAchievementByFaculty(faculty) {
    const achievements = await this._prisma.achievement.findMany({
      select: {
        id: true,
        activity: {
          select: {
            name: true,
            fieldsActivity: true,
            levels: true,
            years: true,
          },
        },
        owner: {
          select: {
            npm: true,
            name: true,
          },
        },
      },
      where: {
        owner: {
          faculty,
        },
      },
    });

    if (!achievements) {
      throw new NotFoundError('Achievement not found');
    }

    return achievements;
  }

  async verifyAchievementAccess(userId, achievementId) {
    const users = await this._usersService.getUserById(userId);

    const achievement = await this._prisma.achievement.findUnique({
      where: {
        id: achievementId,
      },
    });

    if (!achievement) {
      throw new NotFoundError('achievement not found. id is invalid');
    }

    const achievementOwner = await this._usersService.getUserById(
      achievement.ownerId
    );

    if (users.role !== 'ADMIN' || users.role !== 'WD') {
      if (users.faculty !== achievementOwner.faculty) {
        throw new AuthorizationError(
          'Users doesnt not have right to access resources'
        );
      }
    }
  }

  async verifyAvailableActivityId(activityId) {
    const achievement = await this._prisma.achievement.findUnique({
      where: {
        activityId,
      },
    });

    if (achievement) {
      throw new InvariantError('Activity already added to Achievement');
    }
  }
}

export default AchievementsService;
