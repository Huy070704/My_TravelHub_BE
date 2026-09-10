import { Router } from 'express';
import * as budgetsController from './budgets.controller';

export const budgetsRoutes = Router();

budgetsRoutes.get('/', budgetsController.getAll);

