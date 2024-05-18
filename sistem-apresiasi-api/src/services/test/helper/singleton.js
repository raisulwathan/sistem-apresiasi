const { PrismaClient } = require("@prisma/client")
const { mockDeep } = require("jest-mock-extended")

const prisma = require("./client")

jest.mock("./client", () => ({
    __esModule: true,
    default: mockDeep(),
}))

const prismaMock = prisma

module.exports = prismaMock
