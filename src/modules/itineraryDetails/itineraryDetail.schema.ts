import { pgTable, serial, integer, text, decimal } from 'drizzle-orm/pg-core';
import { itineraries } from '../itineraries/itinerary.schema';
import { destinations } from '../destinations/destination.schema';

export const itineraryDetails = pgTable('ItineraryDetails', {
  detailID: serial('DetailID').primaryKey(),
  itineraryID: integer('ItineraryID').notNull().references(() => itineraries.itineraryID),
  destinationID: integer('DestinationID').notNull().references(() => destinations.destinationID),
  dayNumber: integer('DayNumber').notNull(),
  timeSlot: text('TimeSlot'),
  activityDescription: text('ActivityDescription'),
  estimatedCostVND: decimal('EstimatedCostVND', { precision: 18, scale: 0 })
});
