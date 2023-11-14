import { InvariantError } from '../../exceptions/InvariantError';
import { PostSkpiPayloadSchema } from './schema';

export const SkpiValidator = {
  validatePostSkpiPayload: (payload) => {
    const validationResult = PostSkpiPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
