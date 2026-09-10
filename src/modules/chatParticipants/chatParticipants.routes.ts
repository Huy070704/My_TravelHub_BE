import { Router } from 'express';
import * as chatParticipantsController from './chatParticipants.controller';

export const chatParticipantsRoutes = Router();

chatParticipantsRoutes.get('/', chatParticipantsController.getAll);

