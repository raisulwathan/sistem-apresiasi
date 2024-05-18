import { ActivityValidator } from "./index.js"
import { InvariantError } from "../../exceptions/InvariantError.js"
import { PostActivityPayloadSchema, PutActivityPayloadSchema } from "./schema.js"

jest.mock("./schema", () => ({
    PostActivityPayloadSchema: { validate: jest.fn() },
    PutActivityPayloadSchema: { validate: jest.fn() },
}))

describe("ActivityValidator", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe("validatePostActivityPayload", () => {
        it("should validate payload successfully", () => {
            const payload = {
                /* your payload data */
            }
            PostActivityPayloadSchema.validate.mockReturnValue({ error: null })

            expect(() => ActivityValidator.validatePostActivityPayload(payload)).not.toThrow()
        })

        it("should throw InvariantError when validation fails", () => {
            const payload = {
                /* your payload data */
            }
            const errorMessage = "Validation error"
            PostActivityPayloadSchema.validate.mockReturnValue({ error: { message: errorMessage } })

            expect(() => ActivityValidator.validatePostActivityPayload(payload)).toThrow(
                InvariantError
            )
            expect(() => ActivityValidator.validatePostActivityPayload(payload)).toThrow(
                errorMessage
            )
        })
    })

    describe("validatePutActivityPayload", () => {
        it("should validate payload successfully", () => {
            const payload = {
                /* your payload data */
            }
            PutActivityPayloadSchema.validate.mockReturnValue({ error: null })

            expect(() => ActivityValidator.validatePutActivityPayload(payload)).not.toThrow()
        })

        it("should throw InvariantError when validation fails", () => {
            const payload = {
                /* your payload data */
            }
            const errorMessage = "Validation error"
            PutActivityPayloadSchema.validate.mockReturnValue({ error: { message: errorMessage } })

            expect(() => ActivityValidator.validatePutActivityPayload(payload)).toThrow(
                InvariantError
            )
            expect(() => ActivityValidator.validatePutActivityPayload(payload)).toThrow(
                errorMessage
            )
        })
    })
})
