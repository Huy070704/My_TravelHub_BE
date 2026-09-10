import { Router } from 'express';
import * as itineraryDetailsController from './itineraryDetails.controller';

export const itineraryDetailsRoutes = Router();

itineraryDetailsRoutes.get('/', itineraryDetailsController.getAll);

