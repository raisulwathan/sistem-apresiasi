import { PrismaClient } from "@prisma/client"
import { InvariantError } from "../exceptions/InvariantError.js"
import { NotFoundError } from "../exceptions/NotFoundError.js"

const prisma = new PrismaClient()

export async function create(url, userId) {
    const ttdExist = await prisma.ttd.findUnique({
        where: {
            userId,
        },
    })

    if (ttdExist) {
        throw new InvariantError("this user's TTD is exist")
    }

    const ttd = await prisma.ttd.create({
        data: {
            url,
            userId,
            role: "WR",
        },
    })

    return ttd
}

export async function getByUserId(userId) {
    const ttd = await prisma.ttd.findUnique({
        where: {
            userId,
        },
    })

    if (!ttd) {
        throw new NotFoundError("TTD not found")
    }

    return ttd
}
