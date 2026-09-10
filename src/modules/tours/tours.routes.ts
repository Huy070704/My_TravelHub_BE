import { Router } from 'express';
import * as toursController from './tours.controller';

export const toursRoutes = Router();

toursRoutes.get('/', toursController.getAll);

