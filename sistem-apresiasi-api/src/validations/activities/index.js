import { InvariantError } from '../../exceptions/InvariantError.js';
import {
  PostActivityPayloadSchema,
  PutActivityPayloadSchema,
} from './schema.js';

export const ActivityValidator = {
  validatePostActivityPayload: (payload) => {
    const validationResult = PostActivityPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutActivityPayload: (payload) => {
    const validationResult = PutActivityPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
