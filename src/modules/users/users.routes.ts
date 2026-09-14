import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.get('/me', authenticateToken, UsersController.getMe);
router.put('/me', authenticateToken, UsersController.updateMe);
router.put('/me/change-password', authenticateToken, UsersController.updateMyPassword);
router.get('/', UsersController.getAll);

export { router as userRoutes };