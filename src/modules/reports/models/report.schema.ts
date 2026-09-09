import { pgTable, serial, integer, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { posts } from '../../posts/models/post.schema';
import { users } from '../../users/models/user.schema';

export const reports = pgTable('Reports', {
  reportID: serial('ReportID').primaryKey(),
  postID: integer('PostID').notNull().references(() => posts.postID, { onDelete: 'cascade' }),
  reporterID: uuid('ReporterID').notNull().references(() => users.userID),
  reason: text('Reason').notNull(),
  status: text('Status').default('Pending'),
  reportDate: timestamp('ReportDate').defaultNow()
});
