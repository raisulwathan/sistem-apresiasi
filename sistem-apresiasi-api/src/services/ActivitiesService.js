import { PrismaClient } from "@prisma/client"
import { getBobotSKP, loadData } from "../utils/index.js"
import { InvariantError } from "../exceptions/InvariantError.js"
import { NotFoundError } from "../exceptions/NotFoundError.js"
import { AuthorizationError } from "../exceptions/AuthorizationError.js"

const _FIELD_ACTIVITY = {
    kegiatanWajib: "Kegiatan Wajib",
    bidangOrganisasi: "Bidang Organisasi Kemahasiswaan dan Kepemimpinan",
    bidangKeilmuan: "Bidang Penalaran dan Keilmuan, Penyelarasan dan Pengembangan Karir",
    bidangMinatBakat: "Bidang Minat, Bakat, Mental Spritiual Kebangsaan dan Kewirausahaan",
    bidangBaktiSosial: "Bidang Kepedulian Sosial",
    bidangLainnya: "Bidang Lainnya",
}

const prisma = new PrismaClient()

export async function create({
    name,
    fieldActivity,
    activity,
    level,
    possitionAchievement,
    location,
    years,
    fileUrl,
    owner,
}) {
    let point

    if (fieldActivity === "kegiatanWajib") {
        point = 10
    } else {
        const path = `./src/data/${fieldActivity}.json`
        const data = loadData(path)

        point = getBobotSKP(data, { activity, level, possitionAchievement })
    }
    const newFieldActivity = _FIELD_ACTIVITY[fieldActivity]

    const newActivity = await prisma.activity.create({
        data: {
            name,
            fieldsActivity: newFieldActivity,
            activity,
            levels: level,
            possitions_achievements: possitionAchievement,
            locations: location,
            points: point,
            years,
            fileUrl,
            status: "pending",
            ownerId: owner,
        },
    })

    if (!newActivity) {
        throw new InvariantError("failed to add activities")
    }

    return {
        activityId: newActivity.id,
        ownerId: newActivity.ownerId,
    }
}

export async function getByOwnerId(ownerId) {
    const activites = await prisma.activity.findMany({
        select: {
            id: true,
            name: true,
            fieldsActivity: true,
            activity: true,
            points: true,
            status: true,
        },
        where: {
            ownerId,
        },
    })

    if (!activites) {
        throw new NotFoundError("Activity not found")
    }

    return activites
}

export async function getByFaculty(faculty) {
    const activities = await prisma.activity.findMany({
        where: {
            owner: {
                faculty,
            },
        },
        select: {
            id: true,
            name: true,
            fieldsActivity: true,
            activity: true,
            points: true,
            status: true,
            owner: {
                select: {
                    name: true,
                    npm: true,
                },
            },
        },
    })

    if (!activities) {
        throw new NotFoundError("activities not found")
    }

    return activities
}

export async function getById(id) {
    const activity = await prisma.activity.findUnique({
        where: {
            id,
        },
        include: {
            owner: {
                select: {
                    npm: true,
                    name: true,
                    major: true,
                },
            },
        },
    })

    if (!activity) {
        throw new NotFoundError("failed to get users. id not found")
    }

    return activity
}

export async function processActivity(id, status, message) {
    await getById(id)

    const activity = await prisma.activity.update({
        where: {
            id,
        },
        data: {
            status,
        },
    })

    if (!activity) {
        throw new InvariantError("failed to edit activities")
    }

    if (activity.status === "rejected") {
        await prisma.rejectedActivity.create({
            data: {
                message,
                activityId: activity.id,
                ownerId: activity.ownerId,
            },
        })
    }
}

export async function getTotalPoint(ownerId) {
    const activities = await prisma.activity.findMany({
        where: {
            ownerId,
            status: "accepted",
        },
    })

    if (!activities) {
        return (points = 0)
    }

    const pointsByFieldActivity = activities.reduce((acc, activity) => {
        const { fieldsActivity, points } = activity

        acc[fieldsActivity] = (acc[fieldsActivity] || 0) + points
        return acc
    }, {})

    return pointsByFieldActivity
}

export async function verifyOwner(id, ownerId) {
    const activity = await prisma.activity.findUnique({
        where: {
            id,
        },
    })

    if (!activity) {
        throw new NotFoundError("Activity's id not found")
    }

    if (ownerId !== activity.ownerId) {
        throw new AuthorizationError("The user has no right to access these resources")
    }
}

export async function verifyAccess(id, userId) {
    const users = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    })
    const activity = await prisma.activity.findUnique({
        where: {
            id,
        },
        include: {
            owner: true,
        },
    })

    if (users.faculty !== activity.owner.faculty) {
        throw new AuthorizationError("anda tidak berhak mengakses resource ini")
    }
}
