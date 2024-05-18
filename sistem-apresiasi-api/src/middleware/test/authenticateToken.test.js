import { authenticateToken } from "../authenticateToken.js"
import { AuthenticationError } from "../../exceptions/AuthenticationError.js"
import jwt from "jsonwebtoken"

jest.mock("jsonwebtoken")

describe("authenticateToken", () => {
    let req
    let res
    let next

    beforeEach(() => {
        req = {
            headers: {},
        }
        res = {}
        next = jest.fn()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it("should throw AuthenticationError if authorization header is missing", () => {
        expect(() => authenticateToken(req, res, next)).toThrow(AuthenticationError)
        expect(() => authenticateToken(req, res, next)).toThrow("required authorization")
    })

    it("should throw AuthenticationError if token is invalid", () => {
        req.headers.authorization = "Bearer invalidtoken"
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error("Invalid token"), null)
        })

        expect(() => authenticateToken(req, res, next)).toThrow(AuthenticationError)
        expect(() => authenticateToken(req, res, next)).toThrow("Invalid token")
    })

    it("should set req.userId and req.userRole if token is valid and call next", () => {
        req.headers.authorization = "Bearer validtoken"
        const user = { id: "123", role: "admin" }

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, user)
        })

        authenticateToken(req, res, next)

        expect(req.userId).toBe(user.id)
        expect(req.userRole).toBe(user.role)
        expect(next).toHaveBeenCalled()
    })
})
