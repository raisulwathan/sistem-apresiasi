import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { tryCatch } from '../utils/index.js';
import {
  getAchievementByIdController,
  getAchievementsController,
  postAchievementController,
} from '../controllers/achievements.js';
import {
  deleteAchievementIndependentByIdController,
  getAchievementIndependentByFacultyController,
  getAchievementIndependentByIdController,
  getAchievementIndependentController,
  postAchievementIndependentController,
  putAchievementIndependentByIdController,
} from '../controllers/achievementIndependent.js';
import {
  deleteAchievementNonCompetitionByIdController,
  getAchievementNonCompetitionByIdController,
  getAchievementNonCompetitionsByFacultyController,
  getAchievementNonCompetitionsController,
  postAchievementNonCompetitionController,
  putAchievementNonCompetitionByIdController,
} from '../controllers/achievementNonCompetition.js';

const router = express.Router();

router.post('/', authenticateToken, tryCatch(postAchievementController));
router.get('/', authenticateToken, tryCatch(getAchievementsController));
router.post(
  '/independents',
  authenticateToken,
  tryCatch(postAchievementIndependentController)
);
router.get(
  '/independents',
  authenticateToken,
  tryCatch(getAchievementIndependentController)
);
router.get(
  '/independents/faculties',
  authenticateToken,
  tryCatch(getAchievementIndependentByFacultyController)
);
router.get(
  '/independents/:id',
  authenticateToken,
  tryCatch(getAchievementIndependentByIdController)
);
router.put(
  '/independents/:id',
  authenticateToken,
  tryCatch(putAchievementIndependentByIdController)
);
router.delete(
  '/independents/:id',
  authenticateToken,
  tryCatch(deleteAchievementIndependentByIdController)
);
router.post(
  '/noncompetitions',
  authenticateToken,
  tryCatch(postAchievementNonCompetitionController)
);
router.get(
  '/noncompetitions',
  authenticateToken,
  tryCatch(getAchievementNonCompetitionsController)
);
router.get(
  '/noncompetitions/faculties',
  authenticateToken,
  tryCatch(getAchievementNonCompetitionsByFacultyController)
);
router.get(
  '/noncompetitions/:id',
  authenticateToken,
  tryCatch(getAchievementNonCompetitionByIdController)
);
router.put(
  '/noncompetitions/:id',
  authenticateToken,
  tryCatch(putAchievementNonCompetitionByIdController)
);
router.delete(
  '/noncompetitions/:id',
  authenticateToken,
  tryCatch(deleteAchievementNonCompetitionByIdController)
);
router.get('/:id', authenticateToken, tryCatch(getAchievementByIdController));

export default router;
