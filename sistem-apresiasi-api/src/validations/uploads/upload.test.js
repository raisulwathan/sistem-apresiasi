import { UploadValidator } from "./index.js"
import { InvariantError } from "../../exceptions/InvariantError.js"
import { PostUploadsPayloadSchema } from "./schema.js"

jest.mock("./schema", () => ({
    PostUploadsPayloadSchema: { validate: jest.fn() },
}))

describe("UploadValidator", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe("validatePostUploadsPayload", () => {
        it("should validate payload successfully", () => {
            const payload = {
                /* your payload data */
            }
            PostUploadsPayloadSchema.validate.mockReturnValue({ error: null })

            expect(() => UploadValidator.validatePostUploadsPayload(payload)).not.toThrow()
        })

        it("should throw InvariantError when validation fails", () => {
            const payload = {
                /* your payload data */
            }
            const errorMessage = "Validation error"
            PostUploadsPayloadSchema.validate.mockReturnValue({ error: { message: errorMessage } })

            expect(() => UploadValidator.validatePostUploadsPayload(payload)).toThrow(
                InvariantError
            )
            expect(() => UploadValidator.validatePostUploadsPayload(payload)).toThrow(errorMessage)
        })
    })
})
