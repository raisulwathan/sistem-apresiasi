import { PrismaClient } from "@prisma/client"
import { NotFoundError } from "../exceptions/NotFoundError.js"
import { InvariantError } from "../exceptions/InvariantError.js"

const prisma = new PrismaClient()

export async function create({
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
}) {
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
    })

    if (!achievement) {
        throw new InvariantError("fail to create achievement")
    }

    return newAchievement
}

export async function update(
    id,
    {
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
    }
) {
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
    })

    return updatedAchievement
}

export async function getAll() {
    const achievements = await prisma.achievementIndependent.findMany({})
    return achievements
}

export async function getById(id) {
    const achievement = await prisma.achievementIndependent.findUnique({
        where: { id },
    })

    if (!achievement) {
        throw new NotFoundError("fail to get Achievement. id not found")
    }

    return achievement
}

export async function getByFaculty(faculty) {
    const achievements = await prisma.achievementIndependent.findMany({
        where: { faculty },
    })

    if (!achievements) {
        throw new NotFoundError("achievements not found")
    }

    return achievements
}

export async function deleteById(id) {
    const deletedAchievement = await prisma.achievementIndependent.delete({
        where: { id },
    })

    if (!deletedAchievement) {
        throw new InvariantError("failed to delete achievement")
    }
}
