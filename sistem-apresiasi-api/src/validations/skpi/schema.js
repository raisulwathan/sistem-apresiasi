import Joi from 'joi';

export const PostSkpiPayloadSchema = Joi.object({
  mandatoryPoints: Joi.number().required(),
  organizationPoints: Joi.number().required(),
  scientificPoints: Joi.number().required(),
  talentPoints: Joi.number().required(),
  charityPoints: Joi.number().required(),
  otherPoints: Joi.number().required(),
});
