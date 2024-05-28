const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const { execSync } = require("child_process")

module.exports = async () => {
    execSync("npx prisma migrate dev --name init --preview-feature", {
        env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL_TEST },
    })
}
