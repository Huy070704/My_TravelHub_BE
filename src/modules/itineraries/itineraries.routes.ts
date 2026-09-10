import { Router } from 'express';
import * as itinerariesController from './itineraries.controller';

export const itinerariesRoutes = Router();

itinerariesRoutes.get('/', itinerariesController.getAll);

