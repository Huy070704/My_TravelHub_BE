import { pgTable, serial, varchar, timestamp, integer, decimal, text, uuid } from 'drizzle-orm/pg-core';
import { users } from '../users/user.schema';

export const tours = pgTable('Tours', {
  tourID: serial('TourID').primaryKey(),
  slug: varchar('Slug', { length: 255 }).notNull().unique(),
  title: varchar('Title', { length: 255 }).notNull(),
  destination: varchar('Destination', { length: 100 }).notNull(),
  departureLocation: varchar('DepartureLocation', { length: 100 }).notNull(),
  departureDate: timestamp('DepartureDate').notNull(),
  durationDays: integer('DurationDays').notNull(),
  durationText: varchar('DurationText', { length: 50 }),
  priceVND: decimal('PriceVND', { precision: 18, scale: 2 }).notNull(),
  imageUrl: text('ImageUrl'),
  description: text('Description'),
  numberOfBookings: integer('NumberOfBookings').default(0),
  providerID: uuid('ProviderID').references(() => users.userID)
});
