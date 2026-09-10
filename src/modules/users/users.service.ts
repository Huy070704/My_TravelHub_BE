import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { users } from './user.schema';

export const UsersService = {
  async getAllUsers() {
    return db.select().from(users);
  },

  async getUserById(id: string) {
    const result = await db.select().from(users).where(eq(users.userID, id));
    return result[0] || null;
  }
};
