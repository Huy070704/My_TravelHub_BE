import { pgTable, serial, integer, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { posts } from '../posts/post.schema';
import { users } from '../users/user.schema';

export const travelCompanions = pgTable('TravelCompanions', {
  companionID: serial('CompanionID').primaryKey(),
  postID: integer('PostID').references(() => posts.postID),
  requesterID: uuid('RequesterID').notNull().references(() => users.userID),
  receiverID: uuid('ReceiverID').notNull().references(() => users.userID),
  status: text('Status').default('Pending'),
  dateRequested: timestamp('DateRequested').defaultNow()
});
