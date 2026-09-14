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
  },

  async getMe(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const user = await UsersService.getUserById(String(userId));
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
      }

      // Loại bỏ thông tin nhạy cảm trước khi trả về
      const { passwordHash, ...userData } = user;

      return res.status(200).json({
        success: true,
        data: userData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Lỗi server khi lấy thông tin người dùng' });
    }
  }
};
