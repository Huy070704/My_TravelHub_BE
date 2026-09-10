import { pgTable, serial, varchar, timestamp, boolean, integer, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('Users', {
  userID: uuid('UserID').defaultRandom().primaryKey(),
  username: varchar('Username', { length: 50 }).notNull().unique(),
  email: varchar('Email', { length: 100 }).notNull().unique(),
  passwordHash: varchar('PasswordHash', { length: 255 }),
  googleID: varchar('GoogleID', { length: 100 }),
  avatarURL: varchar('AvatarURL', { length: 500 }),
  fullName: varchar('FullName', { length: 100 }),
  dateOfBirth: timestamp('DateOfBirth'),
  studentCode: varchar('StudentCode', { length: 20 }),
  gender: varchar('Gender', { length: 10 }),
  registrationDate: timestamp('RegistrationDate').defaultNow(),
  lastOnline: timestamp('LastOnline'),
  role: varchar('Role', { length: 20 }).default('Customer'),
  isPremium: boolean('IsPremium').default(false),
  premiumExpiryDate: timestamp('PremiumExpiryDate'),
  isBlocked: boolean('IsBlocked').default(false),
  aiGenerationCount: integer('AiGenerationCount').default(0),
  lastAiGenerationDate: timestamp('LastAiGenerationDate'),
  travelPoints: integer('TravelPoints').default(0),
  userCode: varchar('UserCode', { length: 20 })
});
