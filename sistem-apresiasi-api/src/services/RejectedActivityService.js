import { PrismaClient } from "@prisma/client"
import { NotFoundError } from "../exceptions/NotFoundError.js"

const prisma = new PrismaClient()

export async function getByOwnerId(ownerId) {
    const activities = await prisma.rejectedActivity.findMany({
        select: {
            id: true,
            message: true,
            activity: {
                select: {
                    id: true,
                    name: true,
                    fieldsActivity: true,
                },
            },
        },
        where: {
            ownerId,
        },
    })

    if (!activities) {
        throw new NotFoundError("Activity not found")
    }

    return activities
}

export async function getByActivityId(activityId) {
    const activity = await prisma.rejectedActivity.findFirst({
        where: {
            activityId,
        },
    })

    if (!activity) {
        throw new NotFoundError("failed to get activity. id not found")
    }

    return activity
}
