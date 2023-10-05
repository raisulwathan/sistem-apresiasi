import { InvariantError } from '../../exceptions/InvariantError.js';
import { AuthenticationsPayloadSchema } from './schema.js';

export const AuthenticationsValidator = {
  validateAuthenticationsPayload: (payload) => {
    const validationResult = AuthenticationsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
