import { PrismaClient } from "@prisma/client"
import * as RejectedActivityService from "../RejectedActivityService"
import { NotFoundError } from "../../exceptions/NotFoundError"

jest.mock("@prisma/client", () => {
    const PrismaClient = {
        rejectedActivity: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        },
    }
    return { PrismaClient: jest.fn(() => PrismaClient) }
})

let prisma
let mockData
let mockListData

beforeAll(() => {
    prisma = new PrismaClient()
    mockData = {
        id: 1,
        activityId: 1,
    }
    mockListData = [
        {
            id: 1,
            activityId: 1,
        },
        {
            id: 2,
            activityId: 2,
        },
    ]
})

afterEach(() => {
    jest.clearAllMocks()
})

describe("getByOwnerId", () => {
    it("should return empty array when there is no data", async () => {
        prisma.rejectedActivity.findMany.mockResolvedValue([])

        const result = await RejectedActivityService.getByOwnerId(1)

        expect(result).toEqual([])
        expect(prisma.rejectedActivity.findMany).toHaveBeenCalledWith({
            select: {
                id: true,
                message: true,
                activity: {
                    select: {
                        id: true,
                        name: true,
                        fieldsActivity: true,
                    },
                },
            },
            where: {
                ownerId: 1,
            },
        })
    })

    it("should return list of data when data is not empty", async () => {
        prisma.rejectedActivity.findMany.mockResolvedValue(mockListData)

        const result = await RejectedActivityService.getByOwnerId(1)

        expect(result).toEqual(mockListData)
        expect(prisma.rejectedActivity.findMany).toHaveBeenCalledWith({
            select: {
                id: true,
                message: true,
                activity: {
                    select: {
                        id: true,
                        name: true,
                        fieldsActivity: true,
                    },
                },
            },
            where: {
                ownerId: 1,
            },
        })
    })
})

describe("getByActivityId", () => {
    it("should return NotFoundError when rejectedActivity not found", async () => {
        prisma.rejectedActivity.findFirst.mockResolvedValue(null)

        await expect(RejectedActivityService.getByActivityId(1)).rejects.toThrow(NotFoundError)
        expect(prisma.rejectedActivity.findFirst).toHaveBeenCalledWith({
            where: {
                activityId: 1,
            },
        })
    })

    it("should return correct data", async () => {
        prisma.rejectedActivity.findFirst.mockResolvedValue(mockData)

        const result = await RejectedActivityService.getByActivityId(1)

        expect(result).toEqual(mockData)
        expect(prisma.rejectedActivity.findFirst).toHaveBeenCalledWith({
            where: {
                activityId: 1,
            },
        })
    })
})
