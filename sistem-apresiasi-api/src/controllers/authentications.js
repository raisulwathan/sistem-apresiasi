import jwt from "jsonwebtoken"
import * as UsersServices from "../services/UsersService.js"
import { AuthenticationsValidator } from "../validations/authentications/index.js"

export const postAuthentication = async (req, res) => {
    AuthenticationsValidator.validateAuthenticationsPayload(req.body)

    const { npm, password } = req.body

    const { id, role } = await UsersServices.login(npm, password)

    const token = jwt.sign({ id, role }, process.env.TOKEN_SECRET_KEY, {
        expiresIn: process.env.TOKEN_AGE,
    })

    res.status(201)
    res.json({
        status: "success",
        data: {
            token,
            userId: id,
            role,
        },
    })
}
