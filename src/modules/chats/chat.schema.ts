import { pgTable, text, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';

export const chats = pgTable('Chats', {
  chatID: uuid('ChatID').defaultRandom().primaryKey(),
  chatName: text('ChatName'),
  isGroupChat: boolean('IsGroupChat').default(false),
  creationDate: timestamp('CreationDate').defaultNow()
});
