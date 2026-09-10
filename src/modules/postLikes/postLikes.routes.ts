import { Router } from 'express';
import * as postLikesController from './postLikes.controller';

export const postLikesRoutes = Router();

postLikesRoutes.get('/', postLikesController.getAll);

