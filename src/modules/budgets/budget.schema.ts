import { pgTable, serial, integer, text, decimal, timestamp } from 'drizzle-orm/pg-core';
import { itineraries } from '../itineraries/itinerary.schema';

export const budgets = pgTable('Budgets', {
  budgetID: serial('BudgetID').primaryKey(),
  itineraryID: integer('ItineraryID').notNull().references(() => itineraries.itineraryID),
  category: text('Category').notNull(),
  plannedAmountVND: decimal('PlannedAmountVND', { precision: 18, scale: 0 }).notNull(),
  actualAmountVND: decimal('ActualAmountVND', { precision: 18, scale: 0 }),
  transactionDate: timestamp('TransactionDate'),
  notes: text('Notes')
});
