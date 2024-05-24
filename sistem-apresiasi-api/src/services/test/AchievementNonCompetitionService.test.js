import { PrismaClient } from "@prisma/client"
import * as AchievementNonCompetition from "../AchievementNonCompetitionService"
import { InvariantError } from "../../exceptions/InvariantError"
import { NotFoundError } from "../../exceptions/NotFoundError"

jest.mock("@prisma/client", () => {
    const PrismaClient = {
        achievementNonCompetition: {
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
        faculty: "MIPA",
        activity: "kegiatan",
        levelActivity: "Nasional",
        year: "2023",
        fileUrl: "http://sdjshsjdh",
        numberOfStudents: 2,
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
        prisma.achievementNonCompetition.create.mockResolvedValue(null)

        await expect(AchievementNonCompetition.create(mockData)).rejects.toThrow(InvariantError)
        expect(prisma.achievementNonCompetition.create).toHaveBeenCalledWith({
            data: {
                name: mockData.name,
                level_activity: mockData.levelActivity,
                faculty: mockData.faculty,
                year: mockData.year,
                file_url: mockData.fileUrl,
                number_of_students: mockData.numberOfStudents,
                activity: mockData.activity,
            },
        })
    })

    it("should create data correctly", async () => {
        prisma.achievementNonCompetition.create.mockResolvedValue(mockReturnData[0])

        const result = await AchievementNonCompetition.create(mockData)

        expect(result).toEqual(mockReturnData[0])
        expect(prisma.achievementNonCompetition.create).toHaveBeenCalledWith({
            data: {
                name: mockData.name,
                level_activity: mockData.levelActivity,
                faculty: mockData.faculty,
                year: mockData.year,
                file_url: mockData.fileUrl,
                number_of_students: mockData.numberOfStudents,
                activity: mockData.activity,
            },
        })
    })
})

describe("update", () => {
    it("should updated data correctly", async () => {
        prisma.achievementNonCompetition.update.mockResolvedValue(mockReturnData[0])

        const result = await AchievementNonCompetition.update(1, mockData)

        expect(result).toEqual(mockReturnData[0])
        expect(prisma.achievementNonCompetition.update).toHaveBeenCalledWith({
            where: {
                id: 1,
            },
            data: {
                name: mockData.name,
                level_activity: mockData.levelActivity,
                faculty: mockData.faculty,
                year: mockData.year,
                file_url: mockData.fileUrl,
                number_of_students: mockData.numberOfStudents,
                activity: mockData.activity,
            },
        })
    })
})

describe("getAll", () => {
    it("should return data of array", async () => {
        prisma.achievementNonCompetition.findMany.mockResolvedValue(mockReturnData)

        const result = await AchievementNonCompetition.getAll()

        expect(result).toEqual(mockReturnData)
    })
})

describe("getById", () => {
    it("should throw NotFoundError when id not found", async () => {
        prisma.achievementNonCompetition.findUnique.mockResolvedValue(null)

        await expect(AchievementNonCompetition.getById(1)).rejects.toThrow(NotFoundError)
        expect(prisma.achievementNonCompetition.findUnique).toHaveBeenCalledWith({
            where: {
                id: 1,
            },
        })
    })

    it("should return correct data when id founded", async () => {
        prisma.achievementNonCompetition.findUnique.mockResolvedValue(mockReturnData[0])

        const result = await AchievementNonCompetition.getById(1)

        expect(result).toEqual(mockReturnData[0])
        expect(prisma.achievementNonCompetition.findUnique).toHaveBeenCalledWith({
            where: {
                id: 1,
            },
        })
    })
})

describe("getByFaculty", () => {
    it("should return correct data when faculty and data is exist", async () => {
        prisma.achievementNonCompetition.findMany.mockResolvedValue(mockReturnData)

        const result = await AchievementNonCompetition.getByFaculty("MIPA")

        expect(result).toEqual(mockReturnData)
        expect(prisma.achievementNonCompetition.findMany).toHaveBeenCalledWith({
            where: {
                faculty: "MIPA",
            },
        })
    })
})

describe("deleteById", () => {
    it("should throw InvariantError when failed to delete data", async () => {
        prisma.achievementNonCompetition.delete.mockResolvedValue(null)

        await expect(AchievementNonCompetition.deleteById(2)).rejects.toThrow(InvariantError)
        expect(prisma.achievementNonCompetition.delete).toHaveBeenCalledWith({
            where: {
                id: 2,
            },
        })
    })

    it("should delete data by id correctly", async () => {
        prisma.achievementNonCompetition.delete.mockResolvedValue(mockReturnData[1])

        await expect(AchievementNonCompetition.deleteById(2)).resolves.not.toThrow()
        expect(prisma.achievementNonCompetition.delete).toHaveBeenCalledWith({
            where: {
                id: 2,
            },
        })
    })
})
