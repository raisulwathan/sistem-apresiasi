import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import * as UsersService from "../UsersService.js"
import { InvariantError } from "../../exceptions/InvariantError.js"
import { NotFoundError } from "../../exceptions/NotFoundError.js"
import { AuthenticationError } from "../../exceptions/AuthenticationError.js"

// Mock dependencies
jest.mock("@prisma/client", () => {
    const PrismaClient = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    }
    return { PrismaClient: jest.fn(() => PrismaClient) }
})

jest.mock("bcrypt")

jest.mock("../UsersService", () => ({
    ...jest.requireActual("../UsersService"),
    getUserFromWebService: jest.fn(),
}))

let prisma
let mockUser

beforeAll(() => {
    prisma = new PrismaClient()
    mockUser = {
        id: 1,
        name: "John Doe",
        npm: "12345678",
        password: "hashedPassword",
        faculty: "Engineering",
        major: "Computer Science",
        role: "BASIC",
        email: "john.doe@example.com",
        statusActive: "AKTIF",
    }
})

afterEach(() => {
    jest.clearAllMocks()
})

describe("create user", () => {
    it("should create a new user successfully", async () => {
        prisma.user.findUnique.mockResolvedValue(null) // User not found
        bcrypt.hash.mockResolvedValue("hashedPassword") // Mock password hashing
        prisma.user.create.mockResolvedValue(mockUser) // Mock user creation

        const userId = await UsersService.create({
            npm: "12345678",
            name: "John Doe",
            password: "password123",
            faculty: "Engineering",
            major: "Computer Science",
            email: "john.doe@example.com",
        })

        expect(userId).toEqual(mockUser.id)
        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { npm: "12345678" } })
        expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10)
        expect(prisma.user.create).toHaveBeenCalledWith({
            data: {
                name: "John Doe",
                npm: "12345678",
                password: "hashedPassword",
                faculty: "Engineering",
                major: "Computer Science",
                role: "BASIC",
                email: "john.doe@example.com",
                statusActive: "AKTIF",
            },
        })
    })

    it("should throw InvariantError if npm already exists", async () => {
        prisma.user.findUnique.mockResolvedValue(mockUser) // User found

        await expect(
            UsersService.create({
                npm: "12345678",
                name: "John Doe",
                password: "password123",
                faculty: "Engineering",
                major: "Computer Science",
                email: "john.doe@example.com",
            })
        ).rejects.toThrow(InvariantError)

        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { npm: "12345678" } })
        expect(prisma.user.create).not.toHaveBeenCalled()
    })

    it("should throw InvariantError if user creation fails", async () => {
        prisma.user.findUnique.mockResolvedValue(null) // User not found
        bcrypt.hash.mockResolvedValue("hashedPassword") // Mock password hashing
        prisma.user.create.mockResolvedValue(null) // Mock user creation failure

        await expect(
            UsersService.create({
                npm: "12345678",
                name: "John Doe",
                password: "password123",
                faculty: "Engineering",
                major: "Computer Science",
                email: "john.doe@example.com",
            })
        ).rejects.toThrow(InvariantError)

        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { npm: "12345678" } })
        expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10)
        expect(prisma.user.create).toHaveBeenCalledWith({
            data: {
                name: "John Doe",
                npm: "12345678",
                password: "hashedPassword",
                faculty: "Engineering",
                major: "Computer Science",
                role: "BASIC",
                email: "john.doe@example.com",
                statusActive: "AKTIF",
            },
        })
    })
})

describe("checkUserIsExit", () => {
    it("should not throw an error if npm does not exist", async () => {
        prisma.user.findUnique.mockResolvedValue(null) // User not found

        await expect(UsersService.checkUserIsExit("12345678")).resolves.not.toThrow()

        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { npm: "12345678" } })
    })

    it("should throw an error if npm exists", async () => {
        prisma.user.findUnique.mockResolvedValue(mockUser) // User found

        await expect(UsersService.checkUserIsExit("12345678")).rejects.toThrow("npm is exits")

        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { npm: "12345678" } })
    })
})

describe("getById", () => {
    it("should return user if user is found", async () => {
        prisma.user.findUnique.mockResolvedValue(mockUser) // User found

        const result = await UsersService.getById(1)

        expect(result).toEqual(mockUser)
        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it("should throw NotFoundError if user is not found", async () => {
        prisma.user.findUnique.mockResolvedValue(null) // User not found

        await expect(UsersService.getById(1)).rejects.toThrow(NotFoundError)
        await expect(UsersService.getById(1)).rejects.toThrow("User's id not found")

        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
    })
})

describe("update", () => {
    it("should update user role with valid ID", async () => {
        const mockUpdatedUser = { id: 1, role: "ADMIN" }
        prisma.user.update.mockResolvedValue(mockUpdatedUser)

        await expect(UsersService.update(1, "ADMIN")).resolves.toBeUndefined()
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { role: "ADMIN" },
        })
    })

    it("should throw NotFoundError if user ID does not exist", async () => {
        prisma.user.update.mockResolvedValue(null)

        await expect(UsersService.update(99, "ADMIN")).rejects.toThrow(NotFoundError)
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: 99 },
            data: { role: "ADMIN" },
        })
    })
})

describe("login", () => {
    it("should login user when user exists and password matches", async () => {
        const mockUser = { id: 1, role: "BASIC", password: "hashedpassword" }
        prisma.user.findUnique.mockResolvedValue(mockUser)
        bcrypt.compare.mockResolvedValue(true)

        await expect(UsersService.login("12345", "password")).resolves.toEqual({
            id: 1,
            role: "BASIC",
        })
        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { npm: "12345" } })
    })

    // it("should create new user and login when user does not exist", async () => {
    //     prisma.user.findUnique.mockResolvedValue(null)
    //     const mockWebServiceUser = {
    //         email: "test@test.com",
    //         nama: "Test User",
    //         npm: "12345",
    //         status_aktif: "Aktif",
    //         status_lulus: "Belum Lulus",
    //         fakultas: "Fakultas Test",
    //         prodi: "Prodi Test",
    //         no_tlp_mhs: "08123456789",
    //     }
    //     getUserFromWebService.mockResolvedValue(mockWebServiceUser)
    //     bcrypt.hash.mockResolvedValue("hashedpassword")
    //     generateStatusActive.mockReturnValue("AKTIF")
    //     generateStatusGraduate.mockReturnValue("BELUM_LULUS")
    //     const mockNewUser = { id: 2, role: "BASIC" }
    //     prisma.user.create.mockResolvedValue(mockNewUser)

    //     await expect(UsersService.login("12345", "password")).resolves.toEqual({
    //         id: 2,
    //         role: "BASIC",
    //     })
    //     expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { npm: "12345" } })
    //     expect(prisma.user.create).toHaveBeenCalledWith({
    //         data: {
    //             email: "test@test.com",
    //             name: "Test User",
    //             npm: "12345",
    //             password: "hashedpassword",
    //             role: "BASIC",
    //             statusActive: "AKTIF",
    //             statusGraduate: "BELUM_LULUS",
    //             faculty: "Fakultas Test",
    //             major: "Prodi Test",
    //             phoneNumber: "08123456789",
    //         },
    //     })
    // }, 50000)

    it("should throw AuthenticationError when password does not match", async () => {
        const mockUser = { id: 1, role: "BASIC", password: "hashedpassword" }
        prisma.user.findUnique.mockResolvedValue(mockUser)
        bcrypt.compare.mockResolvedValue(false)

        await expect(UsersService.login("12345", "wrongpassword")).rejects.toThrow(
            AuthenticationError
        )
        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { npm: "12345" } })
    })

    // it("should throw AuthenticationError when user from web service does not exist", async () => {
    //     prisma.user.findUnique.mockResolvedValue(null)
    //     getUserFromWebService.mockResolvedValue(null)

    //     await expect(UsersService.login("12345", "password")).rejects.toThrow(AuthenticationError)
    //     expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { npm: "12345" } })
    // })
})
