import { UsersValidator } from "../validations/users/index.js"
import * as UsersServices from "../services/UsersService.js"

export const postUsersController = async (req, res) => {
    UsersValidator.validatePostUsersPayload(req.body)

    const { npm, name, password, faculty, major, role, email } = req.body

    const userId = await UsersServices.create({
        npm,
        name,
        email,
        password,
        faculty,
        major,
        role,
    })

    res.status(201)
    res.json({
        status: "success",
        message: "New user added",
        data: {
            userId,
        },
    })
}

export const getUserByIdController = async (req, res) => {
    const { id } = req.params

    const user = await UsersServices.getById(id)

    res.json({
        status: "success",
        data: {
            user,
        },
    })
}

export const putUsersByIdController = async (req, res) => {
    UsersValidator.validatePutUsersPayload(req.body)

    const { id } = req.params
    const { role } = req.body

    await UsersServices.update(id, role)

    res.json({
        status: "success",
        message: "User role changed",
    })
}
