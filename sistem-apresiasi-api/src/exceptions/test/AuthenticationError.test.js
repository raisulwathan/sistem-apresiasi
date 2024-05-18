// test/AuthenticationError.test.js
import { AuthenticationError } from "../AuthenticationError.js" // Path ke AuthenticationError.js
import { ClientError } from "../ClientError.js" // Path ke ClientError.js

describe("AuthenticationError", () => {
    it("should create an error with message and status code 401", () => {
        const message = "Authentication failed"
        const error = new AuthenticationError(message)

        expect(error).toBeInstanceOf(Error)
        expect(error).toBeInstanceOf(ClientError)
        expect(error).toBeInstanceOf(AuthenticationError)
        expect(error.message).toBe(message)
        expect(error.statusCode).toBe(401)
        expect(error.name).toBe("AuthenticationError")
    })
})
