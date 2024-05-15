import { InvariantError } from "../../exceptions/InvariantError.js"
import { PostTtdPayloadSchema } from "./schema.js"

export function validatePostTtdPayload(payload) {
    const validationResult = PostTtdPayloadSchema.validate(payload)

    if (validationResult.error) {
        throw new InvariantError(validationResult.error.message)
    }
}
