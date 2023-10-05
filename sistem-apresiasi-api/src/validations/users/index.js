import { InvariantError } from '../../exceptions/InvariantError.js';
import { PostUsersPayloadSchema, PutUsersPayloadSchema } from './schema.js';

export const UsersValidator = {
  validatePostUsersPayload: (payload) => {
    const validatorResult = PostUsersPayloadSchema.validate(payload);

    if (validatorResult.error) {
      throw new InvariantError(validatorResult.error.message);
    }
  },

  validatePutUsersPayload: (payload) => {
    const validationResult = PutUsersPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
