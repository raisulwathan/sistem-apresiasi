import request from "supertest"
import express from "express"
import * as TtdService from "../../services/TtdService"
import * as TtdController from "../ttd"
import { errorHandler } from "../../middleware/errorHandler"
import { tryCatch } from "../../utils"
import { InvariantError } from "../../exceptions/InvariantError"

const setUser = (req, res, next) => {
    req.userId = req.header("userId")
    req.userRole = req.header("userRole")
    next()
}

const app = express()

app.use(express.json())
app.use(setUser)

app.post("/ttd", tryCatch(TtdController.create))
app.get("/ttd", tryCatch(TtdController.getByRole))

app.use(errorHandler)

jest.mock("../../services/TtdService")

const mockCreatedTtd = { id: "ttdId", url: "https://example.com/ttd.pdf", userId: "1" }

describe("postTtdController", () => {
    it("should create ttd correclty", async () => {
        TtdService.create.mockResolvedValue(mockCreatedTtd)

        const res = await request(app)
            .post("/ttd")
            .send({ url: mockCreatedTtd.url })
            .set("userId", "1")

        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({
            status: "success",
            data: mockCreatedTtd,
        })
    })
})

describe("getTtdByRoleController", () => {
    it("should return status fail and statusCode 400", async () => {
        const res = await request(app).get("/ttd")

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({
            status: "fail",
            message: "query role is required",
        })
    })

    it("should return ttd correclty", async () => {
        TtdService.getByRole.mockResolvedValue(mockCreatedTtd)

        const res = await request(app).get("/ttd?role=WR")

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            status: "success",
            data: mockCreatedTtd,
        })
    })
})
