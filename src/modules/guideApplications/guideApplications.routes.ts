import { Router } from 'express';
import * as guideApplicationsController from './guideApplications.controller';

export const guideApplicationsRoutes = Router();

guideApplicationsRoutes.get('/', guideApplicationsController.getAll);

