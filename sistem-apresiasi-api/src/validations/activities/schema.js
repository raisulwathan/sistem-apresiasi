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
  level: Joi.string().required(),
  possitionAchievement: Joi.string().required(),
  location: Joi.string().required(),
  fileUrl: Joi.string().required(),
});

export const PutActivityPayloadSchema = Joi.object({
  status: Joi.string().valid('accepted', 'rejected').required(),
});
