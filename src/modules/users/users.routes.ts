import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.get('/me', authenticateToken, UsersController.getMe);
router.get('/', UsersController.getAll);

export { router as userRoutes };