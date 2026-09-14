import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { users } from './user.schema';

export interface UpdateProfileData {
  fullName?: string;
  avatarURL?: string;
  dateOfBirth?: Date | null;
  studentCode?: string;
  gender?: string;
}

export const UsersService = {
  async getAllUsers() {
    return db.select().from(users);
  },

  async getUserById(id: string) {
    const result = await db.select().from(users).where(eq(users.userID, id));
    return result[0] || null;
  },

  async updateProfile(id: string, data: UpdateProfileData) {
    const result = await db
      .update(users)
      .set(data)
      .where(eq(users.userID, id)) 
      .returning();// yeu cau csdl trả về bản ghi đã cập nhật

    // nếu ko có bản ghi nào cập nhật thì nó là result sẽ là rỗng nên result[0] sẽ là undefined, nên return null
    if (!result[0]) return null;

    const { passwordHash, ...safeUser } = result[0];
    return safeUser;
  },

  // 2. Cập nhật Mật khẩu (Nhận hash đã mã hóa)
  async updatePassword(id: string, newPasswordHash: string) {
    await db
      .update(users)
      .set({
        passwordHash: newPasswordHash
      })
      .where(eq(users.userID, id));

    return true;
  }
};
