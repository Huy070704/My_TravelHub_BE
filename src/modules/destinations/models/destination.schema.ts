import { pgTable, serial, text, decimal } from 'drizzle-orm/pg-core';

export const destinations = pgTable('Destinations', {
  destinationID: serial('DestinationID').primaryKey(),
  name: text('Name').notNull(),
  cityProvince: text('CityProvince').notNull(),
  description: text('Description'),
  rate: decimal('Rate', { precision: 18, scale: 1 }),
  image: text('Image'),
  keyMain: text('KeyMain'),
  entranceFee: decimal('EntranceFee', { precision: 18, scale: 0 }),
  accommodationCost: decimal('AccommodationCost', { precision: 18, scale: 0 }),
  totalTourCost: decimal('TotalTourCost', { precision: 18, scale: 0 }),
  tourPricePerPerson: decimal('TourPricePerPerson', { precision: 18, scale: 0 })
});
