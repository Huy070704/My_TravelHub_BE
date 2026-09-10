import { pgTable, timestamp, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { chats } from './chat.schema';
import { users } from '../users/user.schema';

export const chatParticipants = pgTable('ChatParticipants', {
  chatID: uuid('ChatID').notNull().references(() => chats.chatID),
  userID: uuid('UserID').notNull().references(() => users.userID),
  joinedDate: timestamp('JoinedDate').defaultNow()
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.chatID, table.userID] })
  };
});
