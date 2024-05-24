import { PrismaClient } from "@prisma/client"
import * as TtdService from "../TtdService"
import { InvariantError } from "../../exceptions/InvariantError"
import { NotFoundError } from "../../exceptions/NotFoundError"

jest.mock("@prisma/client", () => {
    const PrismaClient = {
        ttd: {
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    }
    return { PrismaClient: jest.fn(() => PrismaClient) }
})

let prisma
let mockData

beforeAll(() => {
    prisma = new PrismaClient()
    mockData = {
        id: 1,
        url: "http://imageUrl",
        role: "WR",
        userId: 1,
    }
})

afterEach(() => {
    jest.clearAllMocks()
})

describe("create", () => {
    it("should return InvariantError when ttd already exist", async () => {
        prisma.ttd.findUnique.mockResolvedValue({ id: 1 })

        await expect(TtdService.create(mockData.url, mockData.userId)).rejects.toThrow(
            InvariantError
        )
        expect(prisma.ttd.create).not.toHaveBeenCalled()
        expect(prisma.ttd.findUnique).toHaveBeenCalledWith({
            where: {
                userId: mockData.userId,
            },
        })
    })

    it("should created data correctly", async () => {
        prisma.ttd.findUnique.mockResolvedValue(null)
        prisma.ttd.create.mockResolvedValue(mockData)

        const result = await TtdService.create(mockData.url, mockData.userId)

        expect(result).toEqual(mockData)
        expect(prisma.ttd.findUnique).toHaveBeenCalledWith({
            where: {
                userId: mockData.userId,
            },
        })
        expect(prisma.ttd.create).toHaveBeenCalledWith({
            data: {
                url: mockData.url,
                userId: mockData.userId,
                role: mockData.role,
            },
        })
    })
})

describe("getByRole", () => {
    it("should return NotFoundError when ttd not found", async () => {
        prisma.ttd.findFirst.mockResolvedValue(null)

        await expect(TtdService.getByRole(mockData.role)).rejects.toThrow(NotFoundError)
        expect(prisma.ttd.findFirst).toHaveBeenCalledWith({
            where: {
                role: mockData.role,
            },
        })
    })

    it("should return correct data", async () => {
        prisma.ttd.findFirst.mockResolvedValue(mockData)

        const result = await TtdService.getByRole(mockData.role)

        expect(result).toEqual(mockData)
        expect(prisma.ttd.findFirst).toHaveBeenCalledWith({
            where: {
                role: mockData.role,
            },
        })
    })
})
