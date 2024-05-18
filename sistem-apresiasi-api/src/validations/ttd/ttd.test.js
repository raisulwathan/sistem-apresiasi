import { validatePostTtdPayload } from "./index.js"
import { InvariantError } from "../../exceptions/InvariantError.js"
import { PostTtdPayloadSchema } from "./schema.js"

jest.mock("./schema", () => ({
    PostTtdPayloadSchema: { validate: jest.fn() },
}))

describe("validatePostTtdPayload", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("should validate payload successfully", () => {
        const payload = {
            /* your payload data */
        }
        PostTtdPayloadSchema.validate.mockReturnValue({ error: null })

        expect(() => validatePostTtdPayload(payload)).not.toThrow()
    })

    it("should throw InvariantError when validation fails", () => {
        const payload = {
            /* your payload data */
        }
        const errorMessage = "Validation error"
        PostTtdPayloadSchema.validate.mockReturnValue({ error: { message: errorMessage } })

        expect(() => validatePostTtdPayload(payload)).toThrow(InvariantError)
        expect(() => validatePostTtdPayload(payload)).toThrow(errorMessage)
    })
})
