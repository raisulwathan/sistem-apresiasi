import Joi from "joi";

export const PostActivityPayloadSchema = Joi.object({
  fieldActivity: Joi.string().valid("kegiatanWajib", "bidangOrganisasi", "bidangKeilmuan", "bidangBaktiSosial", "bidangMinatBakat", "bidangLainnya").required(),
  name: Joi.string().allow(""),
  activity: Joi.string().required(),
  level: Joi.string().allow(""),
  possitionAchievement: Joi.string().allow(""),
  location: Joi.string(),
  years: Joi.string().required(),
  fileUrl: Joi.string().required(),
});

export const PutActivityPayloadSchema = Joi.object({
  status: Joi.string().valid("accepted", "rejected").required(),
  message: Joi.when("status", {
    is: "rejected",
    then: Joi.string().required(),
    otherwise: Joi.optional(),
  }),
});
