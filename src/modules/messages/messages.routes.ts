import { Router } from 'express';
import * as messagesController from './messages.controller';

export const messagesRoutes = Router();

messagesRoutes.get('/', messagesController.getAll);

