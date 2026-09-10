import { Request, Response } from 'express';
import { UsersService } from './users.service';

export const UsersController = {
  async getAll(req: Request, res: Response) {
    try {
      const users = await UsersService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
};
