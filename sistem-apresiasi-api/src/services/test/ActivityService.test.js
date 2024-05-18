import { PrismaClient } from "@prisma/client"
import * as activityService from "../ActivitiesService.js"
import { InvariantError } from "../../exceptions/InvariantError.js"
import { NotFoundError } from "../../exceptions/NotFoundError.js"
import { getBobotSKP, loadData } from "../../utils/index.js"

jest.mock("@prisma/client", () => {
    const PrismaClient = {
        activity: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
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
