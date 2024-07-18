import { boolean, date, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const trips = pgTable('trips', {
  id: uuid('id').defaultRandom().primaryKey(),
  destination: varchar('destination', { length: 128 }),
  isConfirmed: boolean('is_confirmed').notNull().default(false),
  startsAt: date('starts_at').notNull(),
  endsAt: date('ends_at').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export type Trip = typeof trips.$inferSelect
export type NewTrip = typeof trips.$inferInsert
