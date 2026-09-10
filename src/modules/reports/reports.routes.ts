import { Router } from 'express';
import * as reportsController from './reports.controller';

export const reportsRoutes = Router();

reportsRoutes.get('/', reportsController.getAll);

