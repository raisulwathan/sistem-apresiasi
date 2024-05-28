import { InvariantError } from "../exceptions/InvariantError.js"
import * as TtdServices from "../services/TtdService.js"
import { validatePostTtdPayload } from "../validations/ttd/index.js"

export async function create(req, res) {
    validatePostTtdPayload(req.body)

    const { url } = req.body
    const userId = req.userId

    const createdTtd = await TtdServices.create(url, userId)
    res.status(201)
    res.json({
        status: "success",
        data: createdTtd,
    })
}

export async function getByRole(req, res) {
    const role = String(req.query.role)

    if (role !== "WR") {
        throw new InvariantError("query role is required")
    }

    const ttd = await TtdServices.getByRole(role)

    res.json({
        status: "success",
        data: ttd,
    })
}
