import { Router } from 'express';
import { ToursController } from './tours.controller';

export const toursRoutes = Router();

toursRoutes.get('/', ToursController.getAll); //

