import { Router } from 'express';
import { UsersController } from './users.controller';

const router = Router();

router.get('/', UsersController.getAll);

export { router as userRoutes };
