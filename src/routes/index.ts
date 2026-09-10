import { Router } from 'express';
import { userRoutes } from '../modules/users/users.routes';

const router = Router();

// Mount all module routes here
router.use('/users', userRoutes);

export default router;
