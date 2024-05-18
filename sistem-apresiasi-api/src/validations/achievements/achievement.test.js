import { AchievementValidator } from "./index.js"
import { InvariantError } from "../../exceptions/InvariantError.js"
import {
    PostAcheivementPayloadSchema,
    PostAchievementIndependentPayloadSchema,
    PostAchievementNonCompetitionPayloadSchema,
    PutAchievementIndependentPayloadSchema,
    PutAchievementNonCompetitionPayloadSchema,
} from "./schema"

jest.mock("./schema", () => ({
    PostAcheivementPayloadSchema: { validate: jest.fn() },
    PostAchievementIndependentPayloadSchema: { validate: jest.fn() },
    PostAchievementNonCompetitionPayloadSchema: { validate: jest.fn() },
    PutAchievementIndependentPayloadSchema: { validate: jest.fn() },
    PutAchievementNonCompetitionPayloadSchema: { validate: jest.fn() },
}))

describe("AchievementValidator", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe("validatePostAchievementPayload", () => {
        it("should validate payload successfully", () => {
            const payload = {
                /* your payload data */
            }
            PostAcheivementPayloadSchema.validate.mockReturnValue({ error: null })

            expect(() => AchievementValidator.validatePostAchievementPayload(payload)).not.toThrow()
        })

        it("should throw InvariantError when validation fails", () => {
            const payload = {
                /* your payload data */
            }
            const errorMessage = "Validation error"
            PostAcheivementPayloadSchema.validate.mockReturnValue({
                error: { message: errorMessage },
            })

            expect(() => AchievementValidator.validatePostAchievementPayload(payload)).toThrow(
                InvariantError
            )
            expect(() => AchievementValidator.validatePostAchievementPayload(payload)).toThrow(
                errorMessage
            )
        })
    })

    describe("validatePostAchievementIndependentPayload", () => {
        it("should validate payload successfully", () => {
            const payload = {
                /* your payload data */
            }
            PostAchievementIndependentPayloadSchema.validate.mockReturnValue({ error: null })

            expect(() =>
                AchievementValidator.validatePostAchievementIndependentPayload(payload)
            ).not.toThrow()
        })

        it("should throw InvariantError when validation fails", () => {
            const payload = {
                /* your payload data */
            }
            const errorMessage = "Validation error"
            PostAchievementIndependentPayloadSchema.validate.mockReturnValue({
                error: { message: errorMessage },
            })

            expect(() =>
                AchievementValidator.validatePostAchievementIndependentPayload(payload)
            ).toThrow(InvariantError)
            expect(() =>
                AchievementValidator.validatePostAchievementIndependentPayload(payload)
            ).toThrow(errorMessage)
        })
    })

    describe("validatePutAchievementIndependentPayload", () => {
        it("should validate payload successfully", () => {
            const payload = {
                /* your payload data */
            }
            PutAchievementIndependentPayloadSchema.validate.mockReturnValue({ error: null })

            expect(() =>
                AchievementValidator.validatePutAchievementIndependentPayload(payload)
            ).not.toThrow()
        })

        it("should throw InvariantError when validation fails", () => {
            const payload = {
                /* your payload data */
            }
            const errorMessage = "Validation error"
            PutAchievementIndependentPayloadSchema.validate.mockReturnValue({
                error: { message: errorMessage },
            })

            expect(() =>
                AchievementValidator.validatePutAchievementIndependentPayload(payload)
            ).toThrow(InvariantError)
            expect(() =>
                AchievementValidator.validatePutAchievementIndependentPayload(payload)
            ).toThrow(errorMessage)
        })
    })

    describe("validatePostAchievementNonCompetitionPayload", () => {
        it("should validate payload successfully", () => {
            const payload = {
                /* your payload data */
            }
            PostAchievementNonCompetitionPayloadSchema.validate.mockReturnValue({ error: null })

            expect(() =>
                AchievementValidator.validatePostAchievementNonCompetitionPayload(payload)
            ).not.toThrow()
        })

        it("should throw InvariantError when validation fails", () => {
            const payload = {
                /* your payload data */
            }
            const errorMessage = "Validation error"
            PostAchievementNonCompetitionPayloadSchema.validate.mockReturnValue({
                error: { message: errorMessage },
            })

            expect(() =>
                AchievementValidator.validatePostAchievementNonCompetitionPayload(payload)
            ).toThrow(InvariantError)
            expect(() =>
                AchievementValidator.validatePostAchievementNonCompetitionPayload(payload)
            ).toThrow(errorMessage)
        })
    })

    describe("validatePutAchievementNonCompetitionPayload", () => {
        it("should validate payload successfully", () => {
            const payload = {
                /* your payload data */
            }
            PutAchievementNonCompetitionPayloadSchema.validate.mockReturnValue({ error: null })

            expect(() =>
                AchievementValidator.validatePutAchievementNonCompetitionPayload(payload)
            ).not.toThrow()
        })

        it("should throw InvariantError when validation fails", () => {
            const payload = {
                /* your payload data */
            }
            const errorMessage = "Validation error"
            PutAchievementNonCompetitionPayloadSchema.validate.mockReturnValue({
                error: { message: errorMessage },
            })

            expect(() =>
                AchievementValidator.validatePutAchievementNonCompetitionPayload(payload)
            ).toThrow(InvariantError)
            expect(() =>
                AchievementValidator.validatePutAchievementNonCompetitionPayload(payload)
            ).toThrow(errorMessage)
        })
    })
})
