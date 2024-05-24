import { PrismaClient } from "@prisma/client"
import * as AchievementIndependentService from "../AchievementIndependentService"
import { InvariantError } from "../../exceptions/InvariantError"
import { NotFoundError } from "../../exceptions/NotFoundError"

jest.mock("@prisma/client", () => {
    const PrismaClient = {
        achievementIndependent: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    }
    return { PrismaClient: jest.fn(() => PrismaClient) }
})

let prisma
let mockData
let mockReturnData

beforeAll(() => {
    prisma = new PrismaClient()
    mockData = {
        name: "achievement name",
        levelActivity: "level1",
        participantType: "mandiri",
        totalParticipants: 1,
        participants: [
            {
                npm: "20081",
            },
        ],
        faculty: "MIPA",
        major: "Informatika",
        achievement: "Juara 1",
        mentor: "mentor A",
        year: "2023",
        startDate: "newDate",
        endDate: "newDate",
        fileUrl: "http://sdjshsjdh",
    }
    mockReturnData = [
        {
            id: 1,
            name: "nama prestasi 1",
            faculty: "MIPA",
        },
        {
            id: 2,
            name: "nama prestasi 2",
            faculty: "MIPA",
        },
        {
            id: 3,
            name: "nama prestasi 3",
            faculty: "MIPA",
        },
    ]
})

afterEach(() => {
    jest.clearAllMocks()
})

describe("create", () => {
    it("shoudl throw InvariantError when failed to create data", async () => {
        prisma.achievementIndependent.create.mockResolvedValue(null)

        await expect(AchievementIndependentService.create(mockData)).rejects.toThrow(InvariantError)
        expect(prisma.achievementIndependent.create).toHaveBeenCalledWith({
            data: {
                name: mockData.name,
                level_activity: mockData.levelActivity,
                participant_type: mockData.participantType,
                total_participants: mockData.totalParticipants,
                participants: mockData.participants,
                faculty: mockData.faculty,
                major: mockData.major,
                achievement: mockData.achievement,
                mentor: mockData.mentor,
                year: mockData.year,
                start_date: mockData.startDate,
                end_date: mockData.endDate,
                file_url: mockData.fileUrl,
            },
        })
    })

    it("should create data correctly", async () => {
        prisma.achievementIndependent.create.mockResolvedValue(mockReturnData[0])

        const result = await AchievementIndependentService.create(mockData)

        expect(result).toEqual(mockReturnData[0])
        expect(prisma.achievementIndependent.create).toHaveBeenCalledWith({
            data: {
                name: mockData.name,
                level_activity: mockData.levelActivity,
                participant_type: mockData.participantType,
                total_participants: mockData.totalParticipants,
                participants: mockData.participants,
                faculty: mockData.faculty,
                major: mockData.major,
                achievement: mockData.achievement,
                mentor: mockData.mentor,
                year: mockData.year,
                start_date: mockData.startDate,
                end_date: mockData.endDate,
                file_url: mockData.fileUrl,
            },
        })
    })
})

describe("update", () => {
    it("should updated data correctly", async () => {
        prisma.achievementIndependent.update.mockResolvedValue(mockReturnData[0])

        const result = await AchievementIndependentService.update(1, mockData)

        expect(result).toEqual(mockReturnData[0])
        expect(prisma.achievementIndependent.update).toHaveBeenCalledWith({
            where: {
                id: 1,
            },
            data: {
                name: mockData.name,
                level_activity: mockData.levelActivity,
                participant_type: mockData.participantType,
                total_participants: mockData.totalParticipants,
                participants: mockData.participants,
                faculty: mockData.faculty,
                major: mockData.major,
                achievement: mockData.achievement,
                mentor: mockData.mentor,
                year: mockData.year,
                start_date: mockData.startDate,
                end_date: mockData.endDate,
                file_url: mockData.fileUrl,
            },
        })
    })
})

describe("getAll", () => {
    it("should return data of array", async () => {
        prisma.achievementIndependent.findMany.mockResolvedValue(mockReturnData)

        const result = await AchievementIndependentService.getAll()

        expect(result).toEqual(mockReturnData)
    })
})

describe("getById", () => {
    it("should throw NotFoundError when id not found", async () => {
        prisma.achievementIndependent.findUnique.mockResolvedValue(null)

        await expect(AchievementIndependentService.getById(1)).rejects.toThrow(NotFoundError)
        expect(prisma.achievementIndependent.findUnique).toHaveBeenCalledWith({
            where: {
                id: 1,
            },
        })
    })

    it("should return correct data when id founded", async () => {
        prisma.achievementIndependent.findUnique.mockResolvedValue(mockReturnData[0])

        const result = await AchievementIndependentService.getById(1)

        expect(result).toEqual(mockReturnData[0])
        expect(prisma.achievementIndependent.findUnique).toHaveBeenCalledWith({
            where: {
                id: 1,
            },
        })
    })
})

describe("getByFaculty", () => {
    it("should return correct data when faculty and data is exist", async () => {
        prisma.achievementIndependent.findMany.mockResolvedValue(mockReturnData)

        const result = await AchievementIndependentService.getByFaculty("MIPA")

        expect(result).toEqual(mockReturnData)
        expect(prisma.achievementIndependent.findMany).toHaveBeenCalledWith({
            where: {
                faculty: "MIPA",
            },
        })
    })
})

describe("deleteById", () => {
    it("should throw InvariantError when failed to delete data", async () => {
        prisma.achievementIndependent.delete.mockResolvedValue(null)

        await expect(AchievementIndependentService.deleteById(2)).rejects.toThrow(InvariantError)
        expect(prisma.achievementIndependent.delete).toHaveBeenCalledWith({
            where: {
                id: 2,
            },
        })
    })

    it("should delete data by id correctly", async () => {
        prisma.achievementIndependent.delete.mockResolvedValue(mockReturnData[1])

        await expect(AchievementIndependentService.deleteById(2)).resolves.not.toThrow()
        expect(prisma.achievementIndependent.delete).toHaveBeenCalledWith({
            where: {
                id: 2,
            },
        })
    })
})
