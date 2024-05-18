// test/InvariantError.test.js
import { InvariantError } from "../InvariantError.js" // Path ke InvariantError.js
import { ClientError } from "../ClientError.js" // Path ke ClientError.js

describe("InvariantError", () => {
    it("should create an error with message and default status code 400", () => {
        const message = "Invariant error occurred"
        const error = new InvariantError(message)

        expect(error).toBeInstanceOf(Error)
        expect(error).toBeInstanceOf(ClientError)
        expect(error).toBeInstanceOf(InvariantError)
        expect(error.message).toBe(message)
        expect(error.statusCode).toBe(400)
        expect(error.name).toBe("InvariantError")
    })
})
