import { Elysia, t } from 'elysia'

import { db } from '../lib/drizzle'
import dayjs from '../lib/dayjs'
import { trips } from '../../db/schema'
import { eq } from 'drizzle-orm'

const updateTripParamsSchema = t.Object({
  id: t.String({ format: 'uuid' }),
})

const updateTripBodySchema = t.Object({
  destination: t.String({ minLength: 4 }),
  startsAt: t.String({ format: 'date' }),
  endsAt: t.String({ format: 'date' }),
})

export const updateTrip = new Elysia().put(
  '/trips/:id',
  async ({ params, body }) => {
    const trip = await db.query.trips.findFirst({
      where: (trip, { eq }) => eq(trip.id, params.id),
    })

    if (!trip) {
      throw new Error('Trip not found!')
    }
    const { startsAt, endsAt } = body

    if (dayjs(startsAt).isBefore(new Date())) throw new Error('Invalid trip start date.')

    if (dayjs(endsAt).isBefore(startsAt)) throw new Error('Invalid trip end date.')

    await db.update(trips).set(body).where(eq(trips.id, trip.id))

    return { id: trip.id }
  },
  { params: updateTripParamsSchema, body: updateTripBodySchema },
)
