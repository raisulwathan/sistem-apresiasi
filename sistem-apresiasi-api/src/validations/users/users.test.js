import { UsersValidator } from "./index.js"
import { InvariantError } from "../../exceptions/InvariantError.js"
import { PostUsersPayloadSchema, PutUsersPayloadSchema } from "./schema.js"

jest.mock("./schema", () => ({
    PostUsersPayloadSchema: { validate: jest.fn() },
    PutUsersPayloadSchema: { validate: jest.fn() },
}))

describe("UsersValidator", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe("validatePostUsersPayload", () => {
        it("should validate payload successfully", () => {
            const payload = {
                /* your payload data */
            }
            PostUsersPayloadSchema.validate.mockReturnValue({ error: null })

            expect(() => UsersValidator.validatePostUsersPayload(payload)).not.toThrow()
        })

        it("should throw InvariantError when validation fails", () => {
            const payload = {
                /* your payload data */
            }
            const errorMessage = "Validation error"
            PostUsersPayloadSchema.validate.mockReturnValue({ error: { message: errorMessage } })

            expect(() => UsersValidator.validatePostUsersPayload(payload)).toThrow(InvariantError)
            expect(() => UsersValidator.validatePostUsersPayload(payload)).toThrow(errorMessage)
        })
    })

    describe("validatePutUsersPayload", () => {
        it("should validate payload successfully", () => {
            const payload = {
                /* your payload data */
            }
            PutUsersPayloadSchema.validate.mockReturnValue({ error: null })

            expect(() => UsersValidator.validatePutUsersPayload(payload)).not.toThrow()
        })

        it("should throw InvariantError when validation fails", () => {
            const payload = {
                /* your payload data */
            }
            const errorMessage = "Validation error"
            PutUsersPayloadSchema.validate.mockReturnValue({ error: { message: errorMessage } })

            expect(() => UsersValidator.validatePutUsersPayload(payload)).toThrow(InvariantError)
            expect(() => UsersValidator.validatePutUsersPayload(payload)).toThrow(errorMessage)
        })
    })
})
