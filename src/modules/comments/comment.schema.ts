import { pgTable, serial, integer, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { posts } from '../posts/post.schema';
import { users } from '../users/user.schema';

export const comments = pgTable('Comments', {
  commentID: serial('CommentID').primaryKey(),
  postID: integer('PostID').notNull().references(() => posts.postID),
  userID: uuid('UserID').notNull().references(() => users.userID),
  content: text('Content'),
  commentDate: timestamp('CommentDate').defaultNow()
});
