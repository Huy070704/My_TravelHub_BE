import { Router } from 'express';
import * as postsController from './posts.controller';

export const postsRoutes = Router();

postsRoutes.get('/', postsController.getAll);

