import { pgTable, serial, decimal, text, integer, uuid } from 'drizzle-orm/pg-core';
import { users } from './user.schema';

export const userPreferences = pgTable('UserPreferences', {
  preferenceID: serial('PreferenceID').primaryKey(),
  userID: uuid('UserID').notNull().references(() => users.userID),
  preferredBudgetVND: decimal('PreferredBudgetVND', { precision: 18, scale: 0 }),
  travelStyle: text('TravelStyle'),
  favoriteActivities: text('FavoriteActivities'),
  maxDurationDays: integer('MaxDurationDays'),
  preferredDestinations: text('PreferredDestinations')
});
