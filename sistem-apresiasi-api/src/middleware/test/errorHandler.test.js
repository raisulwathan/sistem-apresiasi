// test/errorHandler.test.js
import request from "supertest"
import express from "express"
import { errorHandler } from "../errorHandler.js" // Path ke errorHandler.js
import { ClientError } from "../../exceptions/ClientError.js"

const app = express()

app.get("/client-error", (req, res) => {
    throw new ClientError("Client error occurred", 400)
})

app.get("/server-error", (req, res) => {
    throw new Error("Server error occurred")
})

app.use(errorHandler)

describe("errorHandler middleware", () => {
    it("should handle ClientError and return the appropriate response", async () => {
        const response = await request(app).get("/client-error")

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            status: "fail",
            message: "Client error occurred",
        })
    })

    it("should handle generic errors and return a 500 status code", async () => {
        const response = await request(app).get("/server-error")

        expect(response.status).toBe(500)
        expect(response.text).toBe("Server error occurred")
    })
})
