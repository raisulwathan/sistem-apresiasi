import express from "express"
import { authenticateToken } from "../middleware/authenticateToken.js"
import { tryCatch } from "../utils/index.js"
import {
    getExportAchievementIndependentsController,
    getExportAchievementNonCompetitionByCategoryController,
} from "../controllers/exports.js"

const router = express.Router()

router.get("/independents", authenticateToken, tryCatch(getExportAchievementIndependentsController))
router.get(
    "/noncompetitions/:category",
    authenticateToken,
    tryCatch(getExportAchievementNonCompetitionByCategoryController)
)

export default router
