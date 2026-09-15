import { 
  pgTable, 
  serial, 
  varchar, 
  timestamp, 
  integer, 
  bigint, 
  text, 
  uuid, 
  index 
} from 'drizzle-orm/pg-core';
import { users } from '../users/user.schema';
import { pgEnum } from 'drizzle-orm/pg-core';

export const tourStatusEnum = pgEnum('tour_status', [
  'draft',
  'published',
  'archived',
]);

export const tours = pgTable('Tours', {
  tourID: serial('TourID').primaryKey(),
  slug: varchar('Slug', { length: 255 }).notNull().unique(),
  title: varchar('Title', { length: 255 }).notNull(),
  destination: varchar('Destination', { length: 100 }).notNull(),
  departureLocation: varchar('DepartureLocation', { length: 100 }).notNull(),
  
  // Tối ưu 1: Thêm withTimezone: true để chuẩn hóa múi giờ
  departureDate: timestamp('DepartureDate', { withTimezone: true }).notNull(),
  
  durationDays: integer('DurationDays').notNull(),
  durationText: varchar('DurationText', { length: 50 }),
  
  // Tối ưu 2: Dùng bigint mode number, trả về dạng số trong code, VND không cần thập phân
  priceVND: bigint('PriceVND', { mode: 'number' }).notNull(),
  
  imageUrl: text('ImageUrl'),

   status: tourStatusEnum('status')
      .default('draft')
      .notNull(),
      
  description: text('Description'),
  numberOfBookings: integer('NumberOfBookings').default(0).notNull(),
  
  // Tối ưu 3: Thêm hành vi khi User bị xóa (cascade hoặc set null tùy nghiệp vụ)
  providerID: uuid('ProviderID').references(() => users.userID, { onDelete: 'cascade' }),

  // Tối ưu 4: Bổ sung thời gian tạo / cập nhật
  createdAt: timestamp('CreatedAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('UpdatedAt', { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
}, (table) => [
  // Tối ưu 5: Index cho các cột hay dùng trong WHERE, JOIN và ORDER BY
  index('tours_destination_idx').on(table.destination),
  index('tours_departure_location_idx').on(table.departureLocation),
  index('tours_departure_date_idx').on(table.departureDate),
  index('tours_provider_id_idx').on(table.providerID),
]);