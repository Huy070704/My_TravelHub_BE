import { Router } from 'express';
import { ToursController } from './tours.controller';
import { authenticateToken, authorizeRoles } from '../../middleware/auth.middleware';

export const toursRoutes = Router();

toursRoutes.get('/', ToursController.getAll);
toursRoutes.get('/:slug', ToursController.getBySlug);

toursRoutes.post('/', authenticateToken, authorizeRoles('Partner', 'Admin'), ToursController.create);
toursRoutes.put('/:id', authenticateToken, authorizeRoles('Partner', 'Admin'), ToursController.update);
toursRoutes.delete('/:id', authenticateToken, authorizeRoles('Partner', 'Admin'), ToursController.delete);
