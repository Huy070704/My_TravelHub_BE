import { Router } from 'express';
import * as travelCompanionsController from './travelCompanions.controller';

export const travelCompanionsRoutes = Router();

travelCompanionsRoutes.get('/', travelCompanionsController.getAll);

