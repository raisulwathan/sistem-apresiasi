// test/AuthorizationError.test.js
import { AuthorizationError } from "../AuthorizationError.js" // Path ke AuthorizationError.js
import { ClientError } from "../ClientError.js" // Path ke ClientError.js

describe("AuthorizationError", () => {
    it("should create an error with message and status code 403", () => {
        const message = "Authorization failed"
        const error = new AuthorizationError(message)

        expect(error).toBeInstanceOf(Error)
        expect(error).toBeInstanceOf(ClientError)
        expect(error).toBeInstanceOf(AuthorizationError)
        expect(error.message).toBe(message)
        expect(error.statusCode).toBe(403)
        expect(error.name).toBe("AuthorizationError")
    })
})
