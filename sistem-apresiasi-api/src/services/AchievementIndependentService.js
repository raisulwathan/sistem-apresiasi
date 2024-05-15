// achievementIndependentService.js

import { PrismaClient } from "@prisma/client";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { InvariantError } from "../exceptions/InvariantError.js";

const prisma = new PrismaClient();

class AchievementIndependentService {
  async addAchievementIndependent({ name, levelActivity, participantType, totalParticipants, participants, faculty, major, achievement, mentor, year, startDate, endDate, fileUrl }) {
    const newAchievement = await prisma.achievementIndependent.create({
      data: {
        name,
        level_activity: levelActivity,
        participant_type: participantType,
        total_participants: totalParticipants,
        participants,
        faculty,
        major,
        achievement,
        mentor,
        year,
        start_date: startDate,
        end_date: endDate,
        file_url: fileUrl,
      },
    });

    if (!achievement) {
      throw new InvariantError("fail to create achievement");
    }

    return newAchievement;
  }

  async getAchievementIndependents() {
    const achievements = await prisma.achievementIndependent.findMany({
      select: {
        id: true,
        name: true,
        level_activity: true,
        participant_type: true,
        achievement: true,
        participants: true,
        year: true,
        faculty: true,
      },
    });
    return achievements;
  }

  async putAchievementIndependent(id, { name, levelActivity, participantType, totalParticipants, participants, faculty, major, achievement, mentor, year, startDate, endDate, fileUrl }) {
    const updatedAchievement = await prisma.achievementIndependent.update({
      where: { id },
      data: {
        name,
        level_activity: levelActivity,
        participant_type: participantType,
        total_participants: totalParticipants,
        participants,
        faculty,
        major,
        achievement,
        mentor,
        year,
        start_date: startDate,
        end_date: endDate,
        file_url: fileUrl,
      },
    });

    return updatedAchievement;
  }

  async getAchievementIndependentById(id) {
    const achievement = await prisma.achievementIndependent.findUnique({
      where: { id },
    });

    if (!achievement) {
      throw new NotFoundError("fail to get Achievement. id not found");
    }

    return achievement;
  }

  async getAchievementIndependentByFaculty(faculty) {
    const achievements = await prisma.achievementIndependent.findMany({
      select: {
        id: true,
        name: true,
        level_activity: true,
        participant_type: true,
        achievement: true,
        participants: true,
        major: true,
        year: true,
        faculty: true,
      },
      where: { faculty },
    });

    if (!achievements) {
      throw new NotFoundError("achievements not found");
    }

    return achievements;
  }

  async deleteAchievementIndependentById(id) {
    const deletedAchievement = await prisma.achievementIndependent.delete({
      where: { id },
    });

    if (!deletedAchievement) {
      throw new InvariantError("failed to delete achievement");
    }

    return deletedAchievement;
  }

  async getAchievementIndependentForExport() {
    const achievements = await prisma.achievementIndependent.findMany();
    return achievements;
  }

  async getAchievementIndependentByFacultyForExport(faculty) {
    const achievements = await prisma.achievementIndependent.findMany({
      where: {
        faculty,
      },
    });

    if (!achievements) {
      throw new NotFoundError("achievements not found");
    }

    return achievements;
  }
}

export default AchievementIndependentService;
