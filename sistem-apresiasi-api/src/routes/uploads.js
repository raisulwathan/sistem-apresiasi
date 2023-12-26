import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { tryCatch } from "../utils/index.js";
import { postUploadsController } from "../controllers/uploads.js";
import upload from "../middleware/uploadImage.js";

const router = express.Router();

router.post("/", upload.single("file"), tryCatch(postUploadsController));

export default router;
