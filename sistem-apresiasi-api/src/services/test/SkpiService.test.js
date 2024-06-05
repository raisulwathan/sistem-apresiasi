import { PrismaClient } from "@prisma/client"
import * as MailHelper from "../../utils/mail.utils.js"
import { verifyMinimumPoints } from "../../utils"
import * as SkpiService from "../SkpiService.js"
import { InvariantError } from "../../exceptions/InvariantError.js"
import { NotFoundError } from "../../exceptions/NotFoundError.js"

jest.mock("@prisma/client", () => {
    const PrismaClient = {
        skpi: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findFirst: jest.fn(),
        },
    }
    return { PrismaClient: jest.fn(() => PrismaClient) }
})
jest.mock("../../utils")
jest.mock("../../utils/mail.utils.js")

let prisma
let mockData
let mockReturnDatas
let faculty

beforeAll(() => {
    prisma = new PrismaClient()
    faculty = "MIPA"

    mockData = {
        mandatoryPoints: 10,
        organizationPoints: 20,
        scientificPoints: 15,
        charityPoints: 5,
        talentPoints: 10,
        otherPoints: 5,
        owner: 1,
    }
    mockReturnDatas = [
        {
            id: 1,
            status: "pending",
            owner: {
                npm: 1001,
                name: "Son",
            },
        },
        {
            id: 2,
            status: "accepted by OPERATOR",
            owner: {
                npm: 1002,
                name: "dafa",
            },
        },
    ]
})

afterEach(() => {
    jest.clearAllMocks()
})

describe("create", () => {
    it("should verify minimum points and send email notification", async () => {
        prisma.skpi.create.mockResolvedValue({ id: 1, ownerId: 1 })

        await expect(SkpiService.create(mockData)).resolves.toEqual({ skpiId: 1, ownerId: 1 })

        expect(verifyMinimumPoints).toHaveBeenCalledWith({
            mandatoryPoints: 10,
            organizationPoints: 20,
            scientificPoints: 15,
            charityPoints: 5,
            talentPoints: 10,
            otherPoints: 5,
        })
        expect(prisma.skpi.create).toHaveBeenCalledWith({
            data: {
                mandatoryPoints: 10,
                organizationPoints: 20,
                charityPoints: 5,
                scientificPoints: 15,
                talentPoints: 10,
                otherPoints: 5,
                status: "pending",
                ownerId: 1,
            },
        })
        expect(MailHelper.pushEmailNotificationFaculty).toHaveBeenCalledWith(1, "OPERATOR")
    })

    it("should throw an InvariantError if SKPI creation fails", async () => {
        prisma.skpi.create.mockResolvedValue(null)

        await expect(SkpiService.create(mockData)).rejects.toThrow(InvariantError)

        expect(verifyMinimumPoints).toHaveBeenCalledWith({
            mandatoryPoints: 10,
            organizationPoints: 20,
            scientificPoints: 15,
            charityPoints: 5,
            talentPoints: 10,
            otherPoints: 5,
        })

        expect(prisma.skpi.create).toHaveBeenCalledWith({
            data: {
                mandatoryPoints: 10,
                organizationPoints: 20,
                charityPoints: 5,
                scientificPoints: 15,
                talentPoints: 10,
                otherPoints: 5,
                status: "pending",
                ownerId: 1,
            },
        })

        expect(MailHelper.pushEmailNotificationFaculty).not.toHaveBeenCalled()
    })
})

describe("getAll", () => {
    it("should return empty array when there is no skpi data", async () => {
        prisma.skpi.findMany.mockResolvedValue([])

        const result = await SkpiService.getAll()

        expect(result).toEqual([])
        expect(prisma.skpi.findMany).toHaveBeenCalledWith({
            select: {
                id: true,
                status: true,
                owner: {
                    select: {
                        npm: true,
                        name: true,
                        faculty: true,
                        major: true,
                    },
                },
            },
        })
    })

    it("should return list of data correctly", async () => {
        prisma.skpi.findMany.mockResolvedValue(mockReturnDatas)

        const result = await SkpiService.getAll()

        expect(result).toEqual(mockReturnDatas)
        expect(prisma.skpi.findMany).toHaveBeenCalledWith({
            select: {
                id: true,
                status: true,
                owner: {
                    select: {
                        npm: true,
                        name: true,
                        faculty: true,
                        major: true,
                    },
                },
            },
        })
    })
})

describe("getByFaculty", () => {
    it("should return empty array when there is no skpi data", async () => {
        prisma.skpi.findMany.mockResolvedValue([])
        const result = await SkpiService.getByFaculty(faculty)

        expect(result).toEqual([])
        expect(prisma.skpi.findMany).toHaveBeenCalledWith({
            select: {
                id: true,
                status: true,
                owner: {
                    select: {
                        name: true,
                        npm: true,
                        faculty: true,
                        major: true,
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

    it("should return list of data correctly", async () => {
        prisma.skpi.findMany.mockResolvedValue(mockReturnDatas)

        const result = await SkpiService.getByFaculty(faculty)

        expect(result).toEqual(mockReturnDatas)
        expect(prisma.skpi.findMany).toHaveBeenCalledWith({
            select: {
                id: true,
                status: true,
                owner: {
                    select: {
                        name: true,
                        npm: true,
                        faculty: true,
                        major: true,
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

describe("getByOwnerId", () => {
    it("should return NotFoundError when skpi not found", async () => {
        prisma.skpi.findFirst.mockResolvedValue(null)

        await expect(SkpiService.getByOwnerId(1)).rejects.toThrow(NotFoundError)
        expect(prisma.skpi.findFirst).toHaveBeenCalledWith({
            where: {
                ownerId: 1,
            },
        })
    })

    it("should return valid data when exist", async () => {
        prisma.skpi.findFirst.mockResolvedValue(mockReturnDatas[0])

        const result = await SkpiService.getByOwnerId(1)

        expect(result).toEqual(mockReturnDatas[0])
        expect(prisma.skpi.findFirst).toHaveBeenCalledWith({
            where: {
                ownerId: 1,
            },
        })
    })
})

describe("getById", () => {
    it("should return NotFoundError when skpi not found", async () => {
        prisma.skpi.findUnique.mockResolvedValue(null)

        await expect(SkpiService.getById(1)).rejects.toThrow(NotFoundError)
        expect(prisma.skpi.findUnique).toHaveBeenCalledWith({
            where: {
                id: 1,
            },
            include: {
                owner: {
                    select: {
                        name: true,
                        npm: true,
                        faculty: true,
                        major: true,
                    },
                },
            },
        })
    })

    it("should return valid data when exist", async () => {
        prisma.skpi.findUnique.mockResolvedValue(mockReturnDatas[0])

        const result = await SkpiService.getById(1)

        expect(result).toEqual(mockReturnDatas[0])
        expect(prisma.skpi.findUnique).toHaveBeenCalledWith({
            where: {
                id: 1,
            },
            include: {
                owner: {
                    select: {
                        name: true,
                        npm: true,
                        faculty: true,
                        major: true,
                    },
                },
            },
        })
    })
})

describe("processSkpi", () => {
    it("should return InvariantError when failed to update skpi", async () => {
        prisma.skpi.update.mockResolvedValue(null)

        await expect(SkpiService.processSkpi(1, "accepted")).rejects.toThrow(InvariantError)
        expect(prisma.skpi.update).toHaveBeenCalledWith({
            where: {
                id: 1,
            },
            data: {
                status: "accepted",
            },
        })
    })

    it("should callled pushEmailNotificationFaculty() when status is 'accepted by OPERATOR'", async () => {
        const status = "accepted by OPERATOR"
        const mockUpdatedData = {
            id: 1,
            status,
            ownerId: 1,
        }

        prisma.skpi.update.mockResolvedValue(mockUpdatedData)

        await SkpiService.processSkpi(mockUpdatedData.id, mockUpdatedData.status)

        expect(MailHelper.pushEmailNotificationFaculty).toHaveBeenCalledWith(
            mockUpdatedData.ownerId,
            "WD"
        )
    })

    it("should callled pushEmailNotification() when status is 'accepted by WD'", async () => {
        const status = "accepted by WD"
        const mockUpdatedData = {
            id: 1,
            status,
            ownerId: 1,
        }

        prisma.skpi.update.mockResolvedValue(mockUpdatedData)

        await SkpiService.processSkpi(mockUpdatedData.id, mockUpdatedData.status)

        expect(MailHelper.pushEmailNotification).toHaveBeenCalledWith(
            mockUpdatedData.ownerId,
            "ADMIN"
        )
    })
    it("should callled pushEmailNotification() when status is 'accepted by ADMIN'", async () => {
        const status = "accepted by ADMIN"
        const mockUpdatedData = {
            id: 1,
            status,
            ownerId: 1,
        }

        prisma.skpi.update.mockResolvedValue(mockUpdatedData)

        await SkpiService.processSkpi(mockUpdatedData.id, mockUpdatedData.status)

        expect(MailHelper.pushEmailNotification).toHaveBeenCalledWith(mockUpdatedData.ownerId, "WR")
    })
    it("should callled pushEmailNotificationMahasiswa() when status is 'completed'", async () => {
        const status = "completed"
        const mockUpdatedData = {
            id: 1,
            status,
            ownerId: 1,
        }

        prisma.skpi.update.mockResolvedValue(mockUpdatedData)

        await SkpiService.processSkpi(mockUpdatedData.id, mockUpdatedData.status)

        expect(MailHelper.pushEmailNotificationMahasiswa).toHaveBeenCalledWith(
            mockUpdatedData.ownerId
        )
    })

    it("should callled pushEmailNotificationRejected() when status is 'rejected'", async () => {
        const status = "rejected"
        const mockUpdatedData = {
            id: 1,
            status,
            ownerId: 1,
        }

        prisma.skpi.update.mockResolvedValue(mockUpdatedData)

        await SkpiService.processSkpi(mockUpdatedData.id, mockUpdatedData.status)

        expect(MailHelper.pushEmailNotificationRejected).toHaveBeenCalledWith(
            mockUpdatedData.ownerId
        )
    })

    it("should throw InvariantError when status is out of scope", async () => {
        const status = "dgddg"
        const mockUpdatedData = {
            id: 1,
            status,
            ownerId: 1,
        }

        prisma.skpi.update.mockResolvedValue(mockUpdatedData)

        await expect(
            SkpiService.processSkpi(mockUpdatedData.id, mockUpdatedData.status)
        ).rejects.toThrow(InvariantError)
    })
})

describe("isExist", () => {
    it("should return Invariant error when SKPI for ownerId is already exist", async () => {
        prisma.skpi.findFirst.mockResolvedValue(mockReturnDatas[0])

        await expect(SkpiService.isExist(1)).rejects.toThrow(InvariantError)
        expect(prisma.skpi.findFirst).toHaveBeenCalledWith({
            where: {
                ownerId: 1,
            },
        })
    })

    it("should not return InvariantEror when SKPI for ownerId is not exist", async () => {
        prisma.skpi.findFirst.mockResolvedValue(null)

        await expect(SkpiService.isExist(1)).resolves.not.toThrow()
        expect(prisma.skpi.findFirst).toHaveBeenCalledWith({
            where: {
                ownerId: 1,
            },
        })
    })
})
