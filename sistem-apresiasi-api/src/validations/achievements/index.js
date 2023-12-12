import { InvariantError } from '../../exceptions/InvariantError.js';
import {
  PostAcheivementPayloadSchema,
  PostAchievementIndependentPayloadSchema,
  PostAchievementNonCompetitionPayloadSchema,
  PutAchievementIndependentPayloadSchema,
  PutAchievementNonCompetitionPayloadSchema,
} from './schema.js';

export const AchievementValidator = {
  validatePostAchievementPayload: (payload) => {
    const validationResult = PostAcheivementPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostAchievementIndependentPayload: (payload) => {
    const validationResult =
      PostAchievementIndependentPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutAchievementIndependentPayload: (payload) => {
    const validationResult =
      PutAchievementIndependentPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostAchievementNonCompetitionPayload: (payload) => {
    const validationResult =
      PostAchievementNonCompetitionPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutAchievementNonCompetitionPayload: (payload) => {
    const validationResult =
      PutAchievementNonCompetitionPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
