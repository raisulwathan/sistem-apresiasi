import { UploadValidator } from "../validations/uploads/index.js"

export const postUploadsController = async (req, res) => {
    UploadValidator.validatePostUploadsPayload({ file: req.file })

    const finalUrl = req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename

    res.json({
        status: "success",
        data: {
            fileUrl: finalUrl,
        },
    })
}
