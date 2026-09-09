import { pgTable, timestamp, integer, text, decimal, uuid } from 'drizzle-orm/pg-core';
import { users } from '../../users/models/user.schema';
import { tours } from './tour.schema';

export const tourBookings = pgTable('TourBookings', {
  bookingID: uuid('BookingID').defaultRandom().primaryKey(),
  userID: uuid('UserID').notNull().references(() => users.userID),
  tourID: integer('TourID').notNull().references(() => tours.tourID),
  tourTitle: text('TourTitle').notNull(),
  destination: text('Destination').notNull(),
  imageUrl: text('ImageUrl'),
  departureDate: timestamp('DepartureDate').notNull(),
  fullName: text('FullName').notNull(),
  phone: text('Phone').notNull(),
  email: text('Email'),
  notes: text('Notes'),
  guests: integer('Guests').notNull(),
  totalPriceVND: decimal('TotalPriceVND', { precision: 18, scale: 2 }).notNull(),
  bookingDate: timestamp('BookingDate').defaultNow(),
  status: text('Status').notNull()
});
