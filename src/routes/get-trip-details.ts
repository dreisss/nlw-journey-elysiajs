import { Elysia, t } from 'elysia'

import { db } from '../lib/drizzle'

const getTripDetailsSchema = t.Object({
  id: t.String({ format: 'uuid' }),
})

export const getTripDetails = new Elysia().get(
  '/trips/:id',
  async ({ params }) => {
    const trip = await db.query.trips.findFirst({
      where: (trip, { eq }) => eq(trip.id, params.id),
      columns: {
        id: true,
        destination: true,
        startsAt: true,
        endsAt: true,
        isConfirmed: true,
      },
    })

    if (!trip) {
      throw new Error('Trip not found!')
    }

    return { trip }
  },
  {
    params: getTripDetailsSchema,
  },
)
