import Joi from "joi";

export const PostUploadsPayloadSchema = Joi.object({
  file: Joi.object({
    filename: Joi.string().required(),
    mimetype: Joi.string().valid("image/jpeg", "image/png", "application/pdf").required(), // Jenis file yang diizinkan
    size: Joi.number().max(5000000).required(), // Ukuran file maksimum (dalam byte)
  })
    .unknown(true)
    .required(),
});
