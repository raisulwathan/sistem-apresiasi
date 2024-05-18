import fs from "fs"
import { createUploadsFolder } from "../uploadImage.js"

jest.mock("fs")

describe("createUploadsFolder", () => {
    const uploadsFolder = "./public/uploads"

    afterEach(() => {
        jest.clearAllMocks()
    })

    it("should create the uploads folder if it does not exist", () => {
        fs.existsSync.mockReturnValue(false)
        fs.mkdirSync.mockImplementation(() => {})

        createUploadsFolder()

        expect(fs.existsSync).toHaveBeenCalledWith(uploadsFolder)
        expect(fs.mkdirSync).toHaveBeenCalledWith(uploadsFolder, { recursive: true })
    })

    it("should not create the uploads folder if it already exists", () => {
        fs.existsSync.mockReturnValue(true)

        createUploadsFolder()

        expect(fs.existsSync).toHaveBeenCalledWith(uploadsFolder)
        expect(fs.mkdirSync).not.toHaveBeenCalled()
    })
})
