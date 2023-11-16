import { InvariantError } from '../../exceptions/InvariantError.js';
import { PostSkpiPayloadSchema } from './schema.js';

export const SkpiValidator = {
  validatePostSkpiPayload: (payload) => {
    const validationResult = PostSkpiPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
