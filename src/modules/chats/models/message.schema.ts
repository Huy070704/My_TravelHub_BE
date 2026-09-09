import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { chats } from './chat.schema';
import { users } from '../../users/models/user.schema';

export const messages = pgTable('Messages', {
  messageID: uuid('MessageID').defaultRandom().primaryKey(),
  chatID: uuid('ChatID').notNull().references(() => chats.chatID),
  senderID: uuid('SenderID').notNull().references(() => users.userID),
  content: text('Content'),
  sentDate: timestamp('SentDate').defaultNow()
});
