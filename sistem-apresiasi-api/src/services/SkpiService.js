import { PrismaClient } from "@prisma/client"
import { InvariantError } from "../exceptions/InvariantError.js"
import { NotFoundError } from "../exceptions/NotFoundError.js"
import { verifyMinimumPoints } from "../utils/index.js"
import * as MailHelper from "../utils/mail.utils.js"

const prisma = new PrismaClient()

export async function create({
    mandatoryPoints,
    organizationPoints,
    scientificPoints,
    charityPoints,
    talentPoints,
    otherPoints,
    owner,
}) {
    verifyMinimumPoints({
        mandatoryPoints,
        organizationPoints,
        scientificPoints,
        talentPoints,
        charityPoints,
        otherPoints,
    })

    const newSkpi = await prisma.skpi.create({
        data: {
            mandatoryPoints,
            organizationPoints,
            charityPoints,
            scientificPoints,
            talentPoints,
            otherPoints,
            status: "pending",
            ownerId: owner,
        },
    })

    if (!newSkpi) {
        throw new InvariantError("failed to add SKPI")
    }

    await MailHelper.pushEmailNotificationFaculty(owner, "OPERATOR")

    return newSkpi
}

export async function getAll() {
    const skpi = await prisma.skpi.findMany({
        select: {
            id: true,
            status: true,
            owner: {
                select: {
                    npm: true,
                    name: true,
                    faculty: true,
                    major: true,
                },
            },
        },
    })

    return skpi.filter((data) => data.status != "rejected")
}

export async function getByFaculty(faculty) {
    const skpi = await prisma.skpi.findMany({
        select: {
            id: true,
            status: true,
            owner: {
                select: {
                    name: true,
                    npm: true,
                    faculty: true,
                    major: true,
                },
            },
        },
        where: {
            owner: {
                faculty,
            },
        },
        orderBy: {
            owner: {
                major: "asc",
            },
        },
    })

    return skpi.filter((data) => data.status != "rejected")
}

export async function getByOwnerId(ownerId) {
    const skpi = await prisma.skpi.findFirst({
        where: {
            ownerId,
        },
    })

    if (!skpi) {
        throw new NotFoundError("skpi not found")
    }

    return skpi
}

export async function getById(id) {
    const skpi = await prisma.skpi.findUnique({
        where: {
            id,
        },
        include: {
            owner: {
                select: {
                    name: true,
                    npm: true,
                    faculty: true,
                    major: true,
                },
            },
        },
    })

    if (!skpi) {
        throw new NotFoundError("skpi not found")
    }

    return skpi
}

export async function processSkpi(id, status) {
    const editedSkpi = await prisma.skpi.update({
        where: {
            id,
        },
        data: {
            status,
        },
    })

    if (!editedSkpi) {
        throw new InvariantError("failed to edit skpi status")
    }

    switch (editedSkpi.status) {
        case "rejected":
            await MailHelper.pushEmailNotificationRejected(editedSkpi.ownerId)
            break

        case "accepted by OPERATOR":
            await MailHelper.pushEmailNotificationFaculty(editedSkpi.ownerId, "WD")
            break

        case "accepted by WD":
            await MailHelper.pushEmailNotification(editedSkpi.ownerId, "ADMIN")
            break

        case "accepted by ADMIN":
            await MailHelper.pushEmailNotification(editedSkpi.ownerId, "WR")
            break

        case "completed":
            await MailHelper.pushEmailNotificationMahasiswa(editedSkpi.ownerId)
            break

        default:
            throw new InvariantError("Invalid SKPI status")
    }
}

export async function isExist(ownerId) {
    const skpi = await prisma.skpi.findFirst({
        where: {
            ownerId,
        },
    })

    if (skpi && skpi.status !== "rejected") {
        throw new InvariantError("this users already have skpi data")
    }
}
