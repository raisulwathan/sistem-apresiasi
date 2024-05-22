import { PrismaClient } from "@prisma/client"
import * as activityService from "../ActivitiesService.js"
import { InvariantError } from "../../exceptions/InvariantError.js"
import { NotFoundError } from "../../exceptions/NotFoundError.js"
import { AuthorizationError } from "../../exceptions/AuthorizationError.js"
import { getBobotSKP, loadData } from "../../utils/index.js"

jest.mock("@prisma/client", () => {
    const PrismaClient = {
        activity: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
        },
        rejectedActivity: {
            create: jest.fn(),
        },
        user: {
            findUnique: jest.fn(),
        },
    }
    return { PrismaClient: jest.fn(() => PrismaClient) }
})

jest.mock("../../utils/index", () => ({
    getBobotSKP: jest.fn(),
    loadData: jest.fn(),
}))

let prisma
let mockActivity

beforeAll(() => {
    prisma = new PrismaClient()
    mockActivity = {
        name: "New Activity",
        fieldActivity: "kegiatanWajib",
        activity: "Activity 1",
        level: "Level 1",
        possitionAchievement: "Position 1",
        location: "Location 1",
        years: "2024",
        fileUrl: "file-url",
        owner: "owner_id",
    }
})

afterEach(() => {
    jest.clearAllMocks()
})

describe("Activity Service - create", () => {
    it("should create a new activity with correct data", async () => {
        // Mock loadData and getBobotSKP
        loadData.mockReturnValueOnce({ data: "data" })
        getBobotSKP.mockReturnValueOnce(10)

        // Mock Prisma Client's activity.create method
        prisma.activity.create.mockResolvedValueOnce({ id: 1, ownerId: "owner_id" })

        const result = await activityService.create(mockActivity)

        expect(result).toEqual({ activityId: 1, ownerId: "owner_id" })
        expect(prisma.activity.create).toHaveBeenCalledWith({
            data: {
                name: mockActivity.name,
                fieldsActivity: "Kegiatan Wajib",
                activity: mockActivity.activity,
                levels: mockActivity.level,
                possitions_achievements: mockActivity.possitionAchievement,
                locations: mockActivity.location,
                points: 10,
                years: mockActivity.years,
                fileUrl: mockActivity.fileUrl,
                status: "pending",
                ownerId: mockActivity.owner,
            },
        })
    })

    it("should throw InvariantError if failed to add activity", async () => {
        prisma.activity.create.mockResolvedValueOnce(null)

        await expect(activityService.create({ name: "New Activity" })).rejects.toThrow(
            InvariantError
        )
    })
})

describe("getByIdOwner", () => {
    it("should return activities by owner id", async () => {
        prisma.activity.findMany.mockResolvedValueOnce([
            { id: 1, name: "Activity 1" },
            { id: 2, name: "Activity 2" },
        ])

        const ownerId = "user_id"
        const result = await activityService.getByOwnerId(ownerId)

        expect(result).toEqual([
            { id: 1, name: "Activity 1" },
            { id: 2, name: "Activity 2" },
        ])
        expect(prisma.activity.findMany).toHaveBeenCalledWith({ where: { ownerId } })
    })
    it("should throw NotFoundError if no activities found for the owner", async () => {
        prisma.activity.findMany.mockResolvedValueOnce(null)

        const ownerId = "user_id"
        await expect(activityService.getByOwnerId(ownerId)).rejects.toThrow(NotFoundError)
    })
})

describe("getByFaculty", () => {
    it("should return activities by faculty", async () => {
        prisma.activity.findMany.mockResolvedValueOnce([
            {
                id: 1,
                name: "Activity 1",
                owner: {
                    id: 1,
                    name: "Nama",
                },
            },
            {
                id: 2,
                name: "Activity 2",
                owner: {
                    id: 1,
                    name: "Nama",
                },
            },
        ])

        const faculty = "example faculty"
        const owner = {
            id: 1,
            name: "Nama",
        }
        const result = await activityService.getByFaculty(faculty)

        expect(result).toEqual([
            {
                id: 1,
                name: "Activity 1",
                owner,
            },
            {
                id: 2,
                name: "Activity 2",
                owner,
            },
        ])
        expect(prisma.activity.findMany).toHaveBeenCalledWith({
            where: {
                owner: { faculty },
            },
            include: {
                owner: true,
            },
        })
    })
    it("should throw NotFoundError if no activities found for faculty", async () => {
        prisma.activity.findMany.mockResolvedValueOnce(null)

        const faculty = "example faculty"
        await expect(activityService.getByFaculty(faculty)).rejects.toThrow(NotFoundError)
    })
})

describe("getById", () => {
    it("should return activity by id", async () => {
        const id = 1
        const mockActivity = {
            id: 1,
            owner: {
                npm: "123456",
                name: "John Doe",
                major: "Computer Science",
            },
        }

        // Mock the implementation of prismaInstance.activity.findUnique
        prisma.activity.findUnique.mockResolvedValue(mockActivity)

        // Call the function with the mocked Prisma instance
        const result = await activityService.getById(id)

        // Assertions
        expect(result).toEqual(mockActivity)
        expect(prisma.activity.findUnique).toHaveBeenCalledWith({
            where: { id },
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
    })

    it("should throw NotFoundError if activity is not found", async () => {
        const id = 1

        // Mock the implementation of prismaInstance.activity.findUnique to return null
        prisma.activity.findUnique.mockResolvedValue(null)

        // Call the function with the mocked Prisma instance and expect an error
        await expect(activityService.getById(id)).rejects.toThrow(NotFoundError)
        expect(prisma.activity.findUnique).toHaveBeenCalledWith({
            where: { id },
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
    })
})

describe("processActivity", () => {
    it("should update activity status and create a rejected activity when status is rejected", async () => {
        const id = 1
        const status = "rejected"
        const message = "Some rejection reason"
        const activityData = {
            id: 1,
            ownerId: 1,
            status: "pending",
        }

        prisma.activity.findUnique.mockResolvedValue(activityData)
        prisma.activity.update.mockResolvedValue({ ...activityData, status: "rejected" })

        await activityService.processActivity(id, status, message)

        expect(prisma.activity.update).toHaveBeenCalledWith({
            where: { id },
            data: { status },
        })

        expect(prisma.rejectedActivity.create).toHaveBeenCalledWith({
            data: {
                message,
                activityId: id,
                ownerId: activityData.ownerId,
            },
        })
    })

    it("should throw InvariantError if activity update fails", async () => {
        const id = 1
        const status = "accepted"
        const message = ""
        const activityData = {
            id: 1,
            ownerId: 1,
            status: "pending",
        }

        prisma.activity.findUnique.mockResolvedValue(activityData)
        prisma.activity.update.mockResolvedValue(null)

        await expect(activityService.processActivity(id, status, message)).rejects.toThrow(
            InvariantError
        )

        expect(prisma.activity.update).toHaveBeenCalledWith({
            where: { id },
            data: { status },
        })

        expect(prisma.rejectedActivity.create).not.toHaveBeenCalled()
    })

    it("should throw NotFoundError when activity id is not found", async () => {
        const id = 1
        const status = "accepted"
        const message = ""

        prisma.activity.findUnique.mockResolvedValue(null)

        await expect(activityService.processActivity(id, status, message)).rejects.toThrow(
            NotFoundError
        )

        expect(prisma.activity.update).not.toHaveBeenCalled()
        expect(prisma.rejectedActivity.create).not.toHaveBeenCalled()
    })

    it("should not create a rejected activity if status is not rejected", async () => {
        const id = 1
        const status = "accepted"
        const message = ""
        const activityData = {
            id: 1,
            ownerId: 1,
            status: "pending",
        }

        prisma.activity.findUnique.mockResolvedValue(activityData)
        prisma.activity.update.mockResolvedValue({ ...activityData, status: "accepted" })

        await activityService.processActivity(id, status, message, prisma)

        expect(prisma.activity.update).toHaveBeenCalledWith({
            where: { id },
            data: { status },
        })

        expect(prisma.rejectedActivity.create).not.toHaveBeenCalled()
    })
})

describe("getTotalPoint", () => {
    it("should return total points grouped by fieldActivity for accepted activities", async () => {
        const ownerId = 1
        const activities = [
            { fieldsActivity: "Kegiatan Wajib", points: 10 },
            { fieldsActivity: "Bidang Organisasi", points: 15 },
            { fieldsActivity: "Bidang Organisasi", points: 5 },
        ]

        prisma.activity.findMany.mockResolvedValue(activities)

        const result = await activityService.getTotalPoint(ownerId)

        expect(result).toEqual({
            "Kegiatan Wajib": 10,
            "Bidang Organisasi": 20,
        })

        expect(prisma.activity.findMany).toHaveBeenCalledWith({
            where: {
                ownerId,
                status: "accepted",
            },
        })
    })

    it("should return an empty object if no accepted activities are found", async () => {
        const ownerId = 1

        prisma.activity.findMany.mockResolvedValue(null)

        const result = await activityService.getTotalPoint(ownerId)

        expect(result).toEqual({
            points: 0,
        })

        expect(prisma.activity.findMany).toHaveBeenCalledWith({
            where: {
                ownerId,
                status: "accepted",
            },
        })
    })
})

describe("verifyOwner", () => {
    it("should throw NotFoundError if the activity doesn't exist", async () => {
        prisma.activity.findUnique.mockResolvedValue(null)

        await expect(activityService.verifyOwner(1, 1)).rejects.toThrow(NotFoundError)

        expect(prisma.activity.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
    })

    it("should throw AuthorizationError if ownerId does not match", async () => {
        const activity = { id: 1, ownerId: 2 }
        prisma.activity.findUnique.mockResolvedValue(activity)

        await expect(activityService.verifyOwner(1, 1)).rejects.toThrow(AuthorizationError)

        expect(prisma.activity.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
    })

    it("should not throw an error if ownerId matches", async () => {
        const activity = { id: 1, ownerId: 1 }
        prisma.activity.findUnique.mockResolvedValue(activity)

        await expect(activityService.verifyOwner(1, 1)).resolves.not.toThrow()

        expect(prisma.activity.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
    })
})

describe("verifyAccess", () => {
    it("should throw AuthorizationError if user faculty doesn't match activity owner faculty", async () => {
        const user = { id: 1, faculty: "FacultyA" }
        const activity = {
            id: 1,
            owner: {
                faculty: "FacultyB",
            },
        }
        prisma.user.findUnique.mockResolvedValue(user)
        prisma.activity.findUnique.mockResolvedValue(activity)

        await expect(activityService.verifyAccess(1, 1, prisma)).rejects.toThrow(AuthorizationError)

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
        expect(prisma.activity.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: { owner: true },
        })
    })

    it("should not throw an error if user faculty matches activity owner faculty", async () => {
        const user = { id: 1, faculty: "FacultyA" }
        const activity = {
            id: 1,
            owner: {
                faculty: "FacultyA",
            },
        }
        prisma.user.findUnique.mockResolvedValue(user)
        prisma.activity.findUnique.mockResolvedValue(activity)

        await expect(activityService.verifyAccess(1, 1, prisma)).resolves.not.toThrow()

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        })
        expect(prisma.activity.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: { owner: true },
        })
    })
})
