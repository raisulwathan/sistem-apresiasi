import express from "express"
import { authenticateToken } from "../middleware/authenticateToken.js"
import { tryCatch } from "../utils/index.js"
import * as TtdController from "../controllers/ttd.js"

const router = express.Router()

router.post("/ttd", authenticateToken, tryCatch(TtdController.create))
router.get("/ttd/:userId", authenticateToken, tryCatch(TtdController.getByUserId))
router.get("/ttd", authenticateToken, tryCatch(TtdController.getByRole))

export default router
