import express from "express";
import {
  getActivitiesController,
  getActivityByIdController,
  postActivityController,
  getActivitiesPointsController,
  putStatusActivityController,
  getRejectActivitiesController,
  getRejectActivityByIdController,
  getActivitiesByFacultyController,
} from "../controllers/activities.js";
import { tryCatch } from "../utils/index.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import uploadImage from "../middleware/uploadImage.js";

const router = express.Router();

router.post("/", authenticateToken, uploadImage.single("certificate"), tryCatch(postActivityController));
router.get("/", authenticateToken, tryCatch(getActivitiesController));
router.get("/rejects", authenticateToken, tryCatch(getRejectActivitiesController));
router.get("/points", authenticateToken, tryCatch(getActivitiesPointsController));
router.get("/faculties", authenticateToken, tryCatch(getActivitiesByFacultyController));
router.get("/:id", authenticateToken, tryCatch(getActivityByIdController));
router.put("/:id/validate", authenticateToken, tryCatch(putStatusActivityController));

router.get("/:id/rejects", authenticateToken, tryCatch(getRejectActivityByIdController));

export default router;
