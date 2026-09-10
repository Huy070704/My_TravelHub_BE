import { Router } from 'express';
import * as tourGuideProfilesController from './tourGuideProfiles.controller';

export const tourGuideProfilesRoutes = Router();

tourGuideProfilesRoutes.get('/', tourGuideProfilesController.getAll);

