import request from "supertest"
import express from "express"
import * as UsersService from "../../services/UsersService"
import * as UsersController from "../users"
import { tryCatch } from "../../utils"
import { errorHandler } from "../../middleware/errorHandler"

const setUser = (req, res, next) => {
    req.userId = req.header("userId")
    req.userRole = req.header("userRole")
    next()
}

const app = express()

app.use(express.json())
app.use(setUser)

app.post("/users", tryCatch(UsersController.postUsersController))
app.get("/users/:id", tryCatch(UsersController.getUserByIdController))
app.put("/users/:id", tryCatch(UsersController.putUsersByIdController))

app.use(errorHandler)

jest.mock("../../services/UsersService")

describe("postUserController", () => {
    it("should created users correctly", async () => {
        UsersService.create.mockResolvedValue("1")

        const res = await request(app).post("/users").send({
            npm: "1234567891011",
            name: "John Doe",
            password: "password123",
            faculty: "Engineering",
            major: "Computer Science",
            email: "john.doe@example.com",
        })

        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({
            status: "success",
            message: "New user added",
            data: {
                userId: "1",
            },
        })
        expect(UsersService.create).toHaveBeenCalledWith({
            npm: "1234567891011",
            name: "John Doe",
            password: "password123",
            faculty: "Engineering",
            major: "Computer Science",
            email: "john.doe@example.com",
        })
    })
})

describe("getUserByIdController", () => {
    it("should return data by id", async () => {
        UsersService.getById.mockResolvedValue({
            id: "1",
            name: "John Doe",
            npm: "12345678",
            password: "hashedPassword",
            faculty: "Engineering",
            major: "Computer Science",
            role: "BASIC",
            email: "john.doe@example.com",
            statusActive: "AKTIF",
        })

        const res = await request(app).get("/users/1")

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            status: "success",
            data: {
                user: {
                    id: "1",
                    name: "John Doe",
                    npm: "12345678",
                    password: "hashedPassword",
                    faculty: "Engineering",
                    major: "Computer Science",
                    role: "BASIC",
                    email: "john.doe@example.com",
                    statusActive: "AKTIF",
                },
            },
        })
        expect(UsersService.getById).toHaveBeenCalledWith("1")
    })
})

describe("putUserByIdController", () => {
    it("should updated user correclty", async () => {
        UsersService.update.mockResolvedValue()

        const res = await request(app).put("/users/1").send({ role: "OPERATOR" })

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            status: "success",
            message: "User role changed",
        })
    })
})
