import { relations } from 'drizzle-orm'
import { boolean, date, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const trips = pgTable('trips', {
  id: uuid('id').defaultRandom().primaryKey(),
  destination: varchar('destination', { length: 128 }).notNull(),
  isConfirmed: boolean('is_confirmed').notNull().default(false),
  startsAt: date('starts_at').notNull(),
  endsAt: date('ends_at').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const tripsReations = relations(trips, ({ many }) => ({
  participants: many(participants),
}))

export type Trip = typeof trips.$inferSelect
export type NewTrip = typeof trips.$inferInsert

export const participants = pgTable('participants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 128 }),
  email: varchar('email', { length: 128 }).notNull(),
  isConfirmed: boolean('is_confirmed').default(false),
  isOwner: boolean('is_owner').default(false),

  tripId: uuid('trip_id').notNull(),
})

export const participantsRelations = relations(participants, ({ one }) => ({
  trip: one(trips, {
    fields: [participants.tripId],
    references: [trips.id],
  }),
}))

export type Participant = typeof participants.$inferSelect
export type NewParticipant = typeof participants.$inferInsert
