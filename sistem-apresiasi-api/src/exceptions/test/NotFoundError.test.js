// test/NotFoundError.test.js
import { NotFoundError } from "../NotFoundError.js" // Path ke NotFoundError.js
import { ClientError } from "../ClientError.js" // Path ke ClientError.js

describe("NotFoundError", () => {
    it("should create an error with message and status code 404", () => {
        const message = "Resource not found"
        const error = new NotFoundError(message)

        expect(error).toBeInstanceOf(Error)
        expect(error).toBeInstanceOf(ClientError)
        expect(error).toBeInstanceOf(NotFoundError)
        expect(error.message).toBe(message)
        expect(error.statusCode).toBe(404)
        expect(error.name).toBe("NotFoundError")
    })
})
