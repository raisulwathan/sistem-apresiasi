import express from "express"
import request from "supertest"
import { postUploadsController } from "../uploads"
import { errorHandler } from "../../middleware/errorHandler"
import { tryCatch } from "../../utils"

const app = express()
const setFile = (req, res, next) => {
    req.file = {
        filename: req.header("filename"),
        mimetype: req.header("mimetype"),
        size: req.header("size"),
    }
    next()
}

jest.mock("../../validations/uploads/index")

app.use(express.json())
app.use(setFile)
app.use(express.urlencoded({ extended: true }))

app.post("/uploads", tryCatch(postUploadsController))

app.use(errorHandler)

describe("POST /uploads", () => {
    // it("should return success response with file URL", async () => {
    //     const mockedFileName = "example.jpg"

    //     // Mocking the request file
    //     const file = {
    //         filename: mockedFileName,
    //         mimetype: "png",
    //         size: 40000,
    //     }

    //     // Making the request
    //     const res = await request(app)
    //         .post("/uploads")
    //         .set("filename", file.filename)
    //         .set("mimetype", "png")
    //         .set("size", 50000)

    //     // Assertions
    //     expect(res.status).toBe(200)
    //     expect(res.body).toEqual({
    //         status: "success",
    //         data: {
    //             fileUrl: `http://127.0.0.1:57953/uploads/${mockedFileName}`, // Update the URL accordingly
    //         },
    //     })

    //     // Ensure the validator was called
    //     expect(mockValidate).toHaveBeenCalledWith({ file })
    // })

    it("should return success response with mocked file URL", async () => {
        const mockedFileName = "example.jpg"
        const mockHost = "example.com"

        const mockReq = {
            file: { filename: mockedFileName, mimetype: "png", size: 40000 },
            protocol: "http",
            get: jest.fn(() => mockHost), // Mocking req.get("host")
        }
        const mockRes = {
            json: jest.fn(),
        }

        await postUploadsController(mockReq, mockRes)
        // Ensure req.get was called with the correct parameter
        expect(mockReq.get).toHaveBeenCalledWith("host")

        // Ensure res.json was called with the correct response
        expect(mockRes.json).toHaveBeenCalledWith({
            status: "success",
            data: {
                fileUrl: `http://${mockHost}/uploads/${mockedFileName}`,
            },
        })
    })
})
