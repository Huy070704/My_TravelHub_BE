import { pgTable, serial, integer, text, decimal, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from '../../users/models/user.schema';
import { posts } from '../../posts/models/post.schema';

export const guideApplications = pgTable('GuideApplications', {
  applicationID: serial('ApplicationID').primaryKey(),
  guideID: uuid('GuideID').notNull().references(() => users.userID),
  postID: integer('PostID').notNull().references(() => posts.postID, { onDelete: 'cascade' }),
  status: text('Status').default('Pending'),
  message: text('Message'),
  proposedPriceVND: decimal('ProposedPriceVND', { precision: 18, scale: 0 }),
  appliedDate: timestamp('AppliedDate').defaultNow()
});
