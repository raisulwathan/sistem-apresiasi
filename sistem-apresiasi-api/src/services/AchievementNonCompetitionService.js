import { PrismaClient } from "@prisma/client"
import { NotFoundError } from "../exceptions/NotFoundError.js"
import { InvariantError } from "../exceptions/InvariantError.js"

const prisma = new PrismaClient()

export async function create({
    name,
    category,
    faculty,
    activity,
    levelActivity,
    numberOfStudents,
    year,
    fileUrl,
}) {
    const newAchievement = await prisma.achievementNonCompetition.create({
        data: {
            name,
            category,
            faculty,
            activity,
            level_activity: levelActivity,
            number_of_students: numberOfStudents,
            year,
            file_url: fileUrl,
        },
    })

    if (!newAchievement) {
        throw new InvariantError("failed to add achievement")
    }

    return newAchievement
}

export async function getAll() {
    const achievements = await prisma.achievementNonCompetition.findMany()

    return achievements
}

export async function getById(id) {
    const achievement = await prisma.achievementNonCompetition.findUnique({
        where: {
            id,
        },
    })

    if (!achievement) {
        throw new NotFoundError("failed to get achievement. id not found")
    }

    return achievement
}

export async function getByFaculty(faculty) {
    const achievements = await prisma.achievementNonCompetition.findMany({
        where: {
            faculty,
        },
    })

    return achievements
}

export async function update(
    id,
    { name, category, faculty, activity, levelActivity, numberOfStudents, year, fileUrl }
) {
    const updatedAchievement = await prisma.achievementNonCompetition.update({
        data: {
            name,
            category,
            faculty,
            activity,
            level_activity: levelActivity,
            number_of_students: numberOfStudents,
            year,
            file_url: fileUrl,
        },
        where: {
            id,
        },
    })

    return updatedAchievement
}

export async function deleteById(id) {
    const deletedAchievement = await prisma.achievementNonCompetition.delete({
        where: {
            id,
        },
    })

    if (!deletedAchievement) {
        throw new InvariantError("failed to delete Achievement")
    }

    return deletedAchievement
}
