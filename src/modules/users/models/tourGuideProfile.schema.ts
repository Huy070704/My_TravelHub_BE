import { pgTable, serial, timestamp, varchar, text, uuid } from 'drizzle-orm/pg-core';
import { users } from './user.schema';

export const tourGuideProfiles = pgTable('TourGuideProfiles', {
  profileID: serial('ProfileID').primaryKey(),
  userID: uuid('UserID').notNull().references(() => users.userID, { onDelete: 'cascade' }),
  dateOfBirth: timestamp('DateOfBirth'),
  gender: varchar('Gender', { length: 20 }),
  phone: varchar('Phone', { length: 20 }),
  address: varchar('Address', { length: 255 }),
  experience: varchar('Experience', { length: 20 }),
  languages: varchar('Languages', { length: 255 }),
  locations: varchar('Locations', { length: 500 }),
  bio: text('Bio'),
  tourCategories: varchar('TourCategories', { length: 500 }),
  idFrontUrl: varchar('IdFrontUrl', { length: 500 }),
  idBackUrl: varchar('IdBackUrl', { length: 500 }),
  certUrl: varchar('CertUrl', { length: 500 }),
  guideAvatarUrl: varchar('GuideAvatarUrl', { length: 500 }),
  isVerified: varchar('IsVerified', { length: 20 }).default('Pending'),
  adminNote: text('AdminNote'),
  createdAt: timestamp('CreatedAt').defaultNow()
});
