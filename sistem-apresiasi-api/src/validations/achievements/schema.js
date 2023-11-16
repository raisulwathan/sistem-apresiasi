import Joi from 'joi';

export const PostAcheivementPayloadSchema = Joi.object({
  activityId: Joi.string().required(),
  ownerId: Joi.string().required(),
});
