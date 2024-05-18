import { SkpiValidator } from "./index.js"
import { InvariantError } from "../../exceptions/InvariantError.js"
import { PostSkpiPayloadSchema } from "./schema.js"

jest.mock("./schema", () => ({
    PostSkpiPayloadSchema: { validate: jest.fn() },
}))

describe("SkpiValidator", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe("validatePostSkpiPayload", () => {
        it("should validate payload successfully", () => {
            const payload = {
                /* your payload data */
            }
            PostSkpiPayloadSchema.validate.mockReturnValue({ error: null })

            expect(() => SkpiValidator.validatePostSkpiPayload(payload)).not.toThrow()
        })

        it("should throw InvariantError when validation fails", () => {
            const payload = {
                /* your payload data */
            }
            const errorMessage = "Validation error"
            PostSkpiPayloadSchema.validate.mockReturnValue({ error: { message: errorMessage } })

            expect(() => SkpiValidator.validatePostSkpiPayload(payload)).toThrow(InvariantError)
            expect(() => SkpiValidator.validatePostSkpiPayload(payload)).toThrow(errorMessage)
        })
    })
})
