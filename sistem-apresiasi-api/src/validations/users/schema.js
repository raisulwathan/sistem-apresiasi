import Joi from "joi"

export const PostUsersPayloadSchema = Joi.object({
    npm: Joi.string()
        .length(13)
        .pattern(/^[0-9]+$/)
        .required(),
    name: Joi.string().required(),
    password: Joi.string().min(8).required(),
    faculty: Joi.string(),
    major: Joi.string(),
    role: Joi.string().valid("BASIC", "OPERATOR", "ADMIN", "WD", "WR"),
    email: Joi.string().required().email(),
})

export const PutUsersPayloadSchema = Joi.object({
    role: Joi.string().valid("BASIC", "OPERATOR", "ADMIN", "WD", "WR").required(),
})
