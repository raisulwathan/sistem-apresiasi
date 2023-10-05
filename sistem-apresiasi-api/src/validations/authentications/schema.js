import Joi from 'joi';

export const AuthenticationsPayloadSchema = Joi.object({
  npm: Joi.string().required(),
  password: Joi.string().required(),
});
