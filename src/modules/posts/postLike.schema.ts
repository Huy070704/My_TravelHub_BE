import { pgTable, integer, timestamp, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { users } from '../users/user.schema';
import { posts } from './post.schema';

export const postLikes = pgTable('PostLikes', {
  userID: uuid('UserID').notNull().references(() => users.userID),
  postID: integer('PostID').notNull().references(() => posts.postID, { onDelete: 'cascade' }),
  likedDate: timestamp('LikedDate').defaultNow()
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userID, table.postID] })
  };
});
