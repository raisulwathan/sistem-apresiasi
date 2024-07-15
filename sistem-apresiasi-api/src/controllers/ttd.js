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

export async function getByUserId(req, res) {
    const { userId } = req

    const ttd = await TtdServices.getByUserId(userId)

    res.json({
        status: "success",
        data: ttd,
    })
}
