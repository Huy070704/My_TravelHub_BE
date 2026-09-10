import { Router } from 'express';
import * as refreshTokensController from './refreshTokens.controller';

export const refreshTokensRoutes = Router();

refreshTokensRoutes.get('/', refreshTokensController.getAll);

