// prisma.test.js
import { PrismaClient } from "@prisma/client"
import "dotenv/config"

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL_TESTING,
        },
    },
})

export default prisma
