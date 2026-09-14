import { Request, Response } from 'express';
import { UsersService, UpdateProfileData } from './users.service';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const updateProfileSchema = z.object({
  fullName: z.string().optional(),
  avatarURL: z.string().optional(),
  dateOfBirth: z.string().or(z.date()).optional().nullable(),
  studentCode: z.string().optional(),
  gender: z.string().optional(),
});

const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu cũ"),
  newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
});

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
      const userId = req.user?.userId;;
      
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
  },

async updateMe(req: Request, res: Response) {
  try {
    const userId = (req.user as any)?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const parsedBody = updateProfileSchema.parse(req.body);

    const { dateOfBirth, ...rest } = parsedBody;

    const updateData: UpdateProfileData = {
      ...rest,
      dateOfBirth:
        dateOfBirth === undefined
          ? undefined
          : dateOfBirth === null
            ? null
            : dateOfBirth instanceof Date
              ? dateOfBirth
              : new Date(dateOfBirth),
    };

    const updatedUser = await UsersService.updateProfile(
      String(userId),
      updateData
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.issues[0]?.message ?? 'Dữ liệu không hợp lệ',
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật thông tin',
    });
  }
},

  async updateMyPassword(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { oldPassword, newPassword } = updatePasswordSchema.parse(req.body);

      const user = await UsersService.getUserById(String(userId));
      if (!user) {
        return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
      }

      if (!user.passwordHash) {
        return res.status(400).json({ success: false, message: 'Tài khoản này không có mật khẩu (đăng nhập bằng Google)' });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Mật khẩu cũ không chính xác' });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await UsersService.updatePassword(String(userId), newPasswordHash);

      return res.status(200).json({
        success: true,
        message: 'Cập nhật mật khẩu thành công',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: error.issues[0].message });
      }
      console.error(error);
      return res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật mật khẩu' });
    }
  }
};
