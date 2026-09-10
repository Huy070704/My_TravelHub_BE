import { pgTable, serial, text, timestamp, decimal, varchar, uuid } from 'drizzle-orm/pg-core';
import { users } from '../users/user.schema';

export const itineraries = pgTable('Itineraries', {
  itineraryID: serial('ItineraryID').primaryKey(),
  slug: varchar('Slug', { length: 255 }).notNull().unique(),
  userID: uuid('UserID').notNull().references(() => users.userID),
  tripName: text('TripName').notNull(),
  startDate: timestamp('StartDate').notNull(),
  endDate: timestamp('EndDate').notNull(),
  totalBudgetEstimatedVND: decimal('TotalBudgetEstimatedVND', { precision: 18, scale: 0 }),
  status: text('Status').default('Planned')
});
