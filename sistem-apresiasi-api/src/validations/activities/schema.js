import Joi from 'joi';

export const PostActivityPayloadSchema = Joi.object({
  name: Joi.string().required(),
  fieldActivity: Joi.string()
    .valid(
      'kegiatanWajib',
      'bidangOrganisasi',
      'bidangKeilmuan',
      'bidangBaktiSosial',
      'bidangMinatBakat',
      'bidangLainnya'
    )
    .required(),
  activity: Joi.string().required(),
  level: Joi.string(),
  possitionAchievement: Joi.string(),
  location: Joi.string().required(),
  years: Joi.string().required(),
  fileUrl: Joi.string().required(),
});

export const PutActivityPayloadSchema = Joi.object({
  status: Joi.string().valid('accepted', 'rejected').required(),
  message: Joi.when('status', {
    is: 'rejected',
    then: Joi.string().required(),
    otherwise: Joi.optional(),
  }),
});
