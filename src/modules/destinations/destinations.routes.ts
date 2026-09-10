import { Router } from 'express';
import * as destinationsController from './destinations.controller';

export const destinationsRoutes = Router();

destinationsRoutes.get('/', destinationsController.getAll);

