import { AuthenticationsValidator } from "./index.js"
import { InvariantError } from "../../exceptions/InvariantError.js"
import { AuthenticationsPayloadSchema } from "./schema.js"

jest.mock("./schema", () => ({
    AuthenticationsPayloadSchema: { validate: jest.fn() },
}))

describe("AuthenticationsValidator", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe("validateAuthenticationsPayload", () => {
        it("should validate payload successfully", () => {
            const payload = {
                /* your payload data */
            }
            AuthenticationsPayloadSchema.validate.mockReturnValue({ error: null })

            expect(() =>
                AuthenticationsValidator.validateAuthenticationsPayload(payload)
            ).not.toThrow()
        })

        it("should throw InvariantError when validation fails", () => {
            const payload = {
                /* your payload data */
            }
            const errorMessage = "Validation error"
            AuthenticationsPayloadSchema.validate.mockReturnValue({
                error: { message: errorMessage },
            })

            expect(() => AuthenticationsValidator.validateAuthenticationsPayload(payload)).toThrow(
                InvariantError
            )
            expect(() => AuthenticationsValidator.validateAuthenticationsPayload(payload)).toThrow(
                errorMessage
            )
        })
    })
})
