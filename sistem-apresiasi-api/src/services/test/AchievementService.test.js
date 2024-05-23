import { PrismaClient } from "@prisma/client"
import * as AchievementService from "../AchievementsService"
import { InvariantError } from "../../exceptions/InvariantError"
import { NotFoundError } from "../../exceptions/NotFoundError"
import { AuthorizationError } from "../../exceptions/AuthorizationError"

jest.mock("@prisma/client", () => {
    const PrismaClient = {
        achievement: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        user: {
            findUnique: jest.fn(),
        },
    }
    return { PrismaClient: jest.fn(() => PrismaClient) }
})

let prisma
let mockAchievement
let mockAchievementResultDatas

beforeAll(() => {
    prisma = new PrismaClient()
    mockAchievement = {
        activityId: "activity_id",
        ownerId: "user_id",
    }

    mockAchievementResultDatas = [
        {
            id: "1",
            activity: {
                name: "Activity1",
                fieldsActivity: "Bidang A",
                levels: "Internasional",
                years: "2024",
            },
            owner: {
                npm: "20081",
                name: "Jamal",
            },
        },
        {
            id: "2",
            activity: {
                name: "Activity1",
                fieldsActivity: "Bidang B",
                levels: "Internasional",
                years: "2024",
            },
            owner: {
                npm: "20081",
                name: "Jamal",
            },
        },
    ]
})

afterEach(() => {
    jest.clearAllMocks()
})

describe("create", () => {
    it("should create new achievement with correct data", async () => {
        prisma.achievement.create.mockResolvedValueOnce({
            id: "1",
            activityId: "activity_id",
            ownerId: "user_id",
        })

        const result = await AchievementService.create(
            mockAchievement.activityId,
            mockAchievement.ownerId
        )

        expect(result).toEqual({ achievementId: "1", ownerId: "user_id" })
        expect(prisma.achievement.create).toHaveBeenCalledWith({
            data: {
                activityId: mockAchievement.activityId,
                ownerId: mockAchievement.ownerId,
            },
        })
    })

    it("should throw Invariant error when create failed", async () => {
        prisma.achievement.create.mockResolvedValueOnce(null)

        await expect(
            AchievementService.create(mockAchievement.achievementId, mockAchievement.ownerId)
        ).rejects.toThrow(InvariantError)
    })
})

describe("getAll", () => {
    it("should return list of achievement", async () => {
        prisma.achievement.findMany.mockResolvedValueOnce(mockAchievementResultDatas)

        const result = await AchievementService.getAll()

        expect(result).toEqual(mockAchievementResultDatas)
        expect(prisma.achievement.findMany).toHaveBeenCalledWith({
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
    })
})

describe("getByFaculty", () => {
    it("should return achievement by faculty", async () => {
        const faculty = "faculty A"

        prisma.achievement.findMany.mockResolvedValueOnce(mockAchievementResultDatas)

        const result = await AchievementService.getByFaculty(faculty)

        expect(result).toEqual(mockAchievementResultDatas)
        expect(prisma.achievement.findMany).toHaveBeenCalledWith({
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
    })
})

describe("getById", () => {
    it("should return NotFoundError when achievement not found", async () => {
        prisma.achievement.findUnique.mockResolvedValueOnce(null)

        await expect(AchievementService.getById).rejects.toThrow(NotFoundError)
    })

    it("should return achievement data if id is valid", async () => {
        prisma.achievement.findUnique.mockResolvedValueOnce({
            id: 1,
        })

        const result = await AchievementService.getById(1)

        expect(result).toEqual({ id: 1 })
        expect(prisma.achievement.findUnique).toHaveBeenCalledWith({
            select: {
                activity: true,
                owner: true,
            },
            where: {
                id: 1,
            },
        })
    })
})

describe("verifyAccess", () => {
    it("should throw NotFoundError if achievement not found", async () => {
        prisma.achievement.findUnique.mockResolvedValue(null)

        await expect(AchievementService.verifyAccess(1, 1)).rejects.toThrow(NotFoundError)

        expect(prisma.achievement.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
    })

    it("should throw AuthorizationError if user is not ADMIN or WD and faculties don't match", async () => {
        const user = { id: 1, role: "BASIC", faculty: "FacultyA" }
        const achievement = { id: 1, ownerId: 2 }
        const achievementOwner = { id: 2, faculty: "FacultyB" }

        prisma.user.findUnique
            .mockResolvedValueOnce(user) // First call for user
            .mockResolvedValueOnce(achievementOwner) // Second call for achievementOwner
        prisma.achievement.findUnique.mockResolvedValue(achievement)

        await expect(AchievementService.verifyAccess(1, 1)).rejects.toThrow(AuthorizationError)

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
        expect(prisma.achievement.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: 2 },
        })
    })

    it("should not throw an error if user is ADMIN", async () => {
        const user = { id: 1, role: "ADMIN", faculty: "FacultyA" }
        const achievement = { id: 1, ownerId: 2 }
        const achievementOwner = { id: 2, faculty: "FacultyB" }

        prisma.user.findUnique
            .mockResolvedValueOnce(user) // First call for user
            .mockResolvedValueOnce(achievementOwner) // Second call for achievementOwner
        prisma.achievement.findUnique.mockResolvedValue(achievement)

        await expect(AchievementService.verifyAccess(1, 1)).resolves.not.toThrow()

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
        expect(prisma.achievement.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: 2 },
        })
    })

    it("should not throw an error if user is WD", async () => {
        const user = { id: 1, role: "WD", faculty: "FacultyB" }
        const achievement = { id: 1, ownerId: 2 }
        const achievementOwner = { id: 2, faculty: "FacultyB" }

        prisma.user.findUnique
            .mockResolvedValueOnce(user) // First call for user
            .mockResolvedValueOnce(achievementOwner) // Second call for achievementOwner
        prisma.achievement.findUnique.mockResolvedValue(achievement)

        await expect(AchievementService.verifyAccess(1, 1)).resolves.not.toThrow()

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
        expect(prisma.achievement.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: 2 },
        })
    })

    it("should not throw an error if user faculties match", async () => {
        const user = { id: 1, role: "BASIC", faculty: "FacultyA" }
        const achievement = { id: 1, ownerId: 2 }
        const achievementOwner = { id: 2, faculty: "FacultyA" }

        prisma.user.findUnique
            .mockResolvedValueOnce(user) // First call for user
            .mockResolvedValueOnce(achievementOwner) // Second call for achievementOwner
        prisma.achievement.findUnique.mockResolvedValue(achievement)

        await expect(AchievementService.verifyAccess(1, 1)).resolves.not.toThrow()

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
        expect(prisma.achievement.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: 2 },
        })
    })
})

describe("isActivityExist", () => {
    it("should return InvariantError", async () => {
        prisma.achievement.findUnique.mockResolvedValueOnce({ id: 1 })

        await expect(AchievementService.isActivityExist(1)).rejects.toThrow(InvariantError)
        expect(prisma.achievement.findUnique).toHaveBeenCalledWith({
            where: {
                activityId: 1,
            },
        })
    })
    it("should not return Invariant error when achievement is null", async () => {
        prisma.achievement.findUnique.mockResolvedValueOnce(null)

        await expect(AchievementService.isActivityExist(1)).resolves.not.toThrow()
        expect(prisma.achievement.findUnique).toHaveBeenCalledWith({
            where: {
                activityId: 1,
            },
        })
    })
})
