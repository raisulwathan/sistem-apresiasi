import { PrismaClient } from "@prisma/client";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { InvariantError } from "../exceptions/InvariantError.js";

const prisma = new PrismaClient();

class AchievementNonCompetitionService {
  async addAchievementNonCompetition({ name, category, faculty, activity, numberOfStudents, year, fileUrl }) {
    const newAchievement = await prisma.achievementNonCompetition.create({
      data: {
        name,
        category,
        faculty,
        activity,
        number_of_students: numberOfStudents,
        year,
        file_url: fileUrl,
      },
    });

    if (!newAchievement) {
      throw new InvariantError("failed to add achievement");
    }

    return newAchievement;
  }

  async getAchievementNonCompetitions() {
    const achievements = await prisma.achievementNonCompetition.findMany({
      select: {
        id: true,
        name: true,
        activity: true,
        year: true,
        faculty: true,
      },
    });

    return achievements;
  }

  async getAchievementNonCompetitionById(id) {
    const achievement = await prisma.achievementNonCompetition.findFirst({
      where: {
        id,
      },
    });

    if (!achievement) {
      throw new NotFoundError("failed to get achievement. id not found");
    }

    return achievement;
  }

  async getAchievementNonCompetitionsByFaculty(faculty) {
    const achievements = await prisma.achievementNonCompetition.findMany({
      where: {
        faculty,
      },
      select: {
        id: true,
        name: true,
        activity: true,
        year: true,
        faculty: true,
      },
    });

    if (!faculty) {
      throw new InvariantError("achievement no found. faculty invalid");
    }

    return achievements;
  }

  async editAchievementNonCompetitionById(id, { name, category, faculty, activity, numberOfStudents, year, fileUrl }) {
    const updatedAchievement = await prisma.achievementNonCompetition.update({
      data: {
        name,
        category,
        faculty,
        activity,
        number_of_students: numberOfStudents,
        year,
        file_url: fileUrl,
      },
      where: {
        id,
      },
    });

    if (!updatedAchievement) {
      throw new InvariantError("failed to edit data");
    }

    return updatedAchievement;
  }

  async deleteAchievementNonCompetitionById(id) {
    const deletedAchievement = await prisma.achievementNonCompetition.delete({
      where: {
        id,
      },
    });

    if (!deletedAchievement) {
      throw new InvariantError("failed to delete Achievement");
    }

    return deletedAchievement;
  }

  async verifyAvailableAchivement(id) {
    const achievement = await prisma.achievementNonCompetition.findUnique({
      where: {
        id,
      },
    });

    if (!achievement) {
      throw new InvariantError("failed to get Achievement. id not found");
    }
  }
}

export default AchievementNonCompetitionService;
