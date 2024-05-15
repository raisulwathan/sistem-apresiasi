import { InvariantError } from "../../exceptions/InvariantError.js"
import { PostUploadsPayloadSchema } from "./schema.js"

export const UploadValidator = {
    validatePostUploadsPayload: (payload) => {
        const validationResult = PostUploadsPayloadSchema.validate(payload)

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    },
}
