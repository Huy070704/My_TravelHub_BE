import { pgTable, serial, integer, text, timestamp, boolean, varchar, uuid } from 'drizzle-orm/pg-core';
import { users } from '../../users/models/user.schema';
import { itineraries } from '../../itineraries/models/itinerary.schema';

export const posts = pgTable('Posts', {
  postID: serial('PostID').primaryKey(),
  slug: varchar('Slug', { length: 255 }).notNull().unique(),
  userID: uuid('UserID').notNull().references(() => users.userID),
  itineraryID: integer('ItineraryID').references(() => itineraries.itineraryID),
  postType: text('PostType').notNull(),
  title: text('Title').notNull(),
  content: text('Content'),
  likesCount: integer('LikesCount').default(0),
  isHidden: boolean('IsHidden').default(false),
  creationDate: timestamp('CreationDate').defaultNow()
});
