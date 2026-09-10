import { pgTable, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from '../users/user.schema';

export const refreshTokens = pgTable('RefreshTokens', {
  tokenId: uuid('TokenID').defaultRandom().primaryKey(),
  userId: uuid('UserID').references(() => users.userID, { onDelete: 'cascade' }).notNull(),
  token: varchar('Token', { length: 255 }).notNull(),
  expiryTime: timestamp('ExpiryTime').notNull(),
  createdAt: timestamp('CreatedAt').defaultNow(),
});
