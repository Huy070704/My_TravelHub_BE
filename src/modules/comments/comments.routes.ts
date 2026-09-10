import { Router } from 'express';
import * as commentsController from './comments.controller';

export const commentsRoutes = Router();

commentsRoutes.get('/', commentsController.getAll);

