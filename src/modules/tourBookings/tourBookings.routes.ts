import { Router } from 'express';
import * as tourBookingsController from './tourBookings.controller';

export const tourBookingsRoutes = Router();

tourBookingsRoutes.get('/', tourBookingsController.getAll);

