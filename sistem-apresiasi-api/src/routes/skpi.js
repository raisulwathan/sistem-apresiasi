import express from 'express';
import SkpiService from '../services/SKPIService';
import { tryCatch } from '../utils';
import UsersService from '../services/UsersService';
import SkpiControllers from '../controllers/skpi';
import { SkpiValidator } from '../validations/skpi';
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();
const skpiService = new SkpiService();
const usersService = new UsersService();
const skpiControllers = new SkpiControllers({
  skpiService,
  usersService,
  validator: SkpiValidator,
});

router.post(
  '/',
  authenticateToken,
  tryCatch(skpiControllers.postSkpiController)
);

router.get('/', authenticateToken, tryCatch(skpiControllers.getSkpiController));
router.get(
  '/:id',
  authenticateToken,
  tryCatch(skpiControllers.getSkpiByIdController)
);
router.put(
  '/:id/validate',
  authenticateToken,
  tryCatch(skpiControllers.putStatusSkpiByIdController)
);

export default router;
