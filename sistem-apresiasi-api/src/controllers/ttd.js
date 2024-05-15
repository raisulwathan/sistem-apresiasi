import { InvariantError } from "../exceptions/InvariantError.js"
import * as TtdServices from "../services/TtdService.js"
import { validatePostTtdPayload } from "../validations/ttd/index.js"

export async function create(req, res) {
    validatePostTtdPayload(req.body)

    const { url } = req.body
    const userId = req.userId

    const createdTtd = await TtdServices.create(url, userId)

    res.json({
        status: "success",
        data: createdTtd,
    })
}

export async function getByUserId(req, res) {
    const userId = req.userId

    const ttd = await TtdServices.getByUserId(userId)

    res.json({
        status: "success",
        data: ttd,
    })
}

export async function getByRole(req, res) {
    const role = String(req.query.role)

    if (!role) {
        throw new InvariantError("query role is required")
    }

    const ttd = await TtdServices.getByRole(role)

    res.json({
        status: "success",
        data: ttd,
    })
}
