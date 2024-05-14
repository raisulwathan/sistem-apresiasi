import Joi from "joi"

export const PostTtdPayloadSchema = Joi.object({
    url: Joi.string().required(),
})
