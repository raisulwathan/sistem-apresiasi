import { UploadValidator } from "../validations/uploads"

export const postUploadsController = async (req, res) => {
    UploadValidator.validatePostUploadsPayload(req.file)

    const finalUrl = req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename

    res.json({
        status: "success",
        data: {
            fileUrl: finalUrl,
        },
    })
}
