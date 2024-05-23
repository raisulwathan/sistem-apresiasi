import { PrismaClient } from "@prisma/client"
import { InvariantError } from "../exceptions/InvariantError.js"
import { NotFoundError } from "../exceptions/NotFoundError.js"
import { AuthorizationError } from "../exceptions/AuthorizationError.js"

const prisma = new PrismaClient()

export async function create(activityId, ownerId) {
    const addedAchievement = await prisma.achievement.create({
        data: {
            activityId,
            ownerId,
        },
    })

    if (!addedAchievement) {
        throw new InvariantError("failed to add new Achievement")
    }

    return {
        achievementId: addedAchievement.id,
        ownerId: addedAchievement.ownerId,
    }
}

export async function getAll() {
    const achievements = await prisma.achievement.findMany({
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
    })

    return achievements
}

export async function getById(id) {
    const achievement = await prisma.achievement.findUnique({
        select: {
            activity: true,
            owner: true,
        },
        where: {
            id,
        },
    })

    if (!achievement) {
        throw new NotFoundError("Acheivement not found. id is invalid")
    }

    return achievement
}

export async function getByFaculty(faculty) {
    const achievements = await prisma.achievement.findMany({
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
    })

    return achievements
}

export async function verifyAccess(userId, achievementId) {
    const users = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    })

    const achievement = await prisma.achievement.findUnique({
        where: {
            id: achievementId,
        },
    })

    if (!achievement) {
        throw new NotFoundError("achievement not found. id is invalid")
    }

    const achievementOwner = await prisma.user.findUnique({
        where: {
            id: achievement.ownerId,
        },
    })

    if (users.role !== "ADMIN" && users.role !== "WR") {
        if (users.faculty !== achievementOwner.faculty) {
            throw new AuthorizationError("Users doesnt not have right to access resources")
        }
    }
}

export async function isActivityExist(activityId) {
    const achievement = await prisma.achievement.findUnique({
        where: {
            activityId,
        },
    })

    if (achievement) {
        throw new InvariantError("Activity already added to Achievement")
    }
}
