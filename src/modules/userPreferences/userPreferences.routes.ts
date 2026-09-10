import { Router } from 'express';
import * as userPreferencesController from './userPreferences.controller';

export const userPreferencesRoutes = Router();

userPreferencesRoutes.get('/', userPreferencesController.getAll);

