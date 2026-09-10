import { Router } from 'express';
import * as chatsController from './chats.controller';

export const chatsRoutes = Router();

chatsRoutes.get('/', chatsController.getAll);

