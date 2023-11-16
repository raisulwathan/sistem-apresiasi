import { InvariantError } from '../../exceptions/InvariantError.js';
import { PostAcheivementPayloadSchema } from './schema.js';

export const AchievementValidator = {
  validatePostAchievementPayload: (payload) => {
    const validationResult = PostAcheivementPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
