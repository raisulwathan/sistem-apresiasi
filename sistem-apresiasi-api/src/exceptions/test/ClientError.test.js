// test/ClientError.test.js
import { ClientError } from "../ClientError.js" // Path ke ClientError.js

describe("ClientError", () => {
    it("should create an error with message and default status code 400", () => {
        const message = "This is a client error"
        const error = new ClientError(message)

        expect(error).toBeInstanceOf(Error)
        expect(error).toBeInstanceOf(ClientError)
        expect(error.message).toBe(message)
        expect(error.statusCode).toBe(400)
        expect(error.name).toBe("ClientError")
    })

    it("should create an error with custom status code", () => {
        const message = "This is a client error"
        const statusCode = 401
        const error = new ClientError(message, statusCode)

        expect(error).toBeInstanceOf(Error)
        expect(error).toBeInstanceOf(ClientError)
        expect(error.message).toBe(message)
        expect(error.statusCode).toBe(statusCode)
        expect(error.name).toBe("ClientError")
    })
})
