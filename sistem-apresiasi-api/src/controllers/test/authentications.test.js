import jwt from "jsonwebtoken"
import * as UsersServices from "../../services/UsersService.js"
import { AuthenticationsValidator } from "../../validations/authentications/index.js"
import request from "supertest"
import express from "express"
import { errorHandler } from "../../middleware/errorHandler.js"
import { tryCatch } from "../../utils/index.js"
import * as AuthenticationsController from "../authentications.js"
import { InvariantError } from "../../exceptions/InvariantError.js"
import { AuthenticationError } from "../../exceptions/AuthenticationError.js"

const app = express()

app.use(express.json())

app.post("/authentications", tryCatch(AuthenticationsController.postAuthentication))

app.use(errorHandler)

jest.mock("jsonwebtoken")
jest.mock("../../services/UsersService")
jest.mock("../../validations/authentications/index")

describe("postAuthentication", () => {
    const mockToken = "mockedToken"
    const userCredentials = { npm: "123456789", password: "password" }
    const mockUser = { id: 1, role: "USER" }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should validate the authentication payload", async () => {
        AuthenticationsValidator.validateAuthenticationsPayload.mockImplementation(() => {})

        UsersServices.login.mockResolvedValue(mockUser)
        jwt.sign.mockReturnValue(mockToken)

        const res = await request(app).post("/authentications").send(userCredentials)

        expect(AuthenticationsValidator.validateAuthenticationsPayload).toHaveBeenCalledWith(
            userCredentials
        )
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({
            status: "success",
            data: {
                token: mockToken,
                userId: mockUser.id,
                role: mockUser.role,
            },
        })
    })

    it("should return 400 if validation fails", async () => {
        AuthenticationsValidator.validateAuthenticationsPayload.mockImplementation(() => {
            throw new InvariantError("Validation error")
        })

        const res = await request(app).post("/authentications").send(userCredentials)

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({
            status: "fail",
            message: "Validation error",
        })
    })

    it("should return 401 if login fails", async () => {
        AuthenticationsValidator.validateAuthenticationsPayload.mockImplementation(() => {})

        UsersServices.login.mockImplementation(() => {
            throw new AuthenticationError("Login failed")
        })

        const res = await request(app).post("/authentications").send(userCredentials)

        expect(res.statusCode).toBe(401)
        expect(res.body).toEqual({
            status: "fail",
            message: "Login failed",
        })
    })
})
