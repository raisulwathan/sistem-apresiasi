jest.mock("@prisma/client", () => {
    const mPrismaClient = {
        user: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
        },
    }
    return { PrismaClient: jest.fn(() => mPrismaClient) }
})

jest.mock("../../pkg/mail.js", () => ({
    sendNotificationEmail: jest.fn(),
}))

import { PrismaClient } from "@prisma/client"
import { sendNotificationEmail } from "../../pkg/mail.js"
import {
    pushEmailNotificationFaculty,
    pushEmailNotification,
    pushEmailNotificationMahasiswa,
} from "../mail.utils.js"

const prisma = new PrismaClient()

describe("Notification Functions", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("pushEmailNotificationFaculty", () => {
        it("should send email notification to faculty approver", async () => {
            const user = {
                id: 1,
                name: "User One",
                npm: "123",
                faculty: "Science",
                major: "Physics",
                email: "user1@example.com",
            }
            const approver = { email: "approver@example.com" }

            prisma.user.findUnique.mockResolvedValue(user)
            prisma.user.findFirst.mockResolvedValue(approver)

            await pushEmailNotificationFaculty(1, "facultyRole")

            expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
            expect(prisma.user.findFirst).toHaveBeenCalledWith({
                where: { faculty: "Science", role: "facultyRole" },
            })
            expect(sendNotificationEmail).toHaveBeenCalledWith(
                "approver@example.com",
                expect.stringContaining("Nama: User One")
            )
        })

        it("should throw an error if user is not found", async () => {
            prisma.user.findUnique.mockResolvedValue(null)

            await expect(pushEmailNotificationFaculty(1, "facultyRole")).rejects.toThrow()
        })

        it("should throw an error if approver is not found", async () => {
            const user = {
                id: 1,
                name: "User One",
                npm: "123",
                faculty: "Science",
                major: "Physics",
                email: "user1@example.com",
            }

            prisma.user.findUnique.mockResolvedValue(user)
            prisma.user.findFirst.mockResolvedValue(null)

            await expect(pushEmailNotificationFaculty(1, "facultyRole")).rejects.toThrow()
        })
    })

    describe("pushEmailNotification", () => {
        it("should send email notification to role approver", async () => {
            const user = {
                id: 1,
                name: "User One",
                npm: "123",
                faculty: "Science",
                email: "user1@example.com",
            }
            const approver = { email: "approver@example.com" }

            prisma.user.findUnique.mockResolvedValue(user)
            prisma.user.findFirst.mockResolvedValue(approver)

            await pushEmailNotification(1, "role")

            expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
            expect(prisma.user.findFirst).toHaveBeenCalledWith({ where: { role: "role" } })
            expect(sendNotificationEmail).toHaveBeenCalledWith(
                "approver@example.com",
                expect.stringContaining("Nama: User One")
            )
        })

        it("should throw an error if user is not found", async () => {
            prisma.user.findUnique.mockResolvedValue(null)

            await expect(pushEmailNotification(1, "role")).rejects.toThrow()
        })

        it("should throw an error if approver is not found", async () => {
            const user = {
                id: 1,
                name: "User One",
                npm: "123",
                faculty: "Science",
                email: "user1@example.com",
            }

            prisma.user.findUnique.mockResolvedValue(user)
            prisma.user.findFirst.mockResolvedValue(null)

            await expect(pushEmailNotification(1, "role")).rejects.toThrow()
        })
    })

    describe("pushEmailNotificationMahasiswa", () => {
        it("should send email notification to student", async () => {
            const user = {
                id: 1,
                name: "User One",
                npm: "123",
                faculty: "Science",
                email: "user1@example.com",
            }

            prisma.user.findUnique.mockResolvedValue(user)

            await pushEmailNotificationMahasiswa(1)

            expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
            expect(sendNotificationEmail).toHaveBeenCalledWith(
                "user1@example.com",
                expect.stringContaining("SKPI Anda sudah Selesai")
            )
        })

        it("should throw an error if user is not found", async () => {
            prisma.user.findUnique.mockResolvedValue(null)

            await expect(pushEmailNotificationMahasiswa(1)).rejects.toThrow()
        })
    })
})
