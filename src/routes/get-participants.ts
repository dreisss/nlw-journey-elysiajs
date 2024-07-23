import { Elysia, t } from 'elysia'

import { db } from '../lib/drizzle'

const getParticipantsSchema = t.Object({
  id: t.String({ format: 'uuid' }),
})

export const getParticipants = new Elysia().get(
  '/trips/:id/participants',
  async ({ params }) => {
    const trip = await db.query.trips.findFirst({
      where: (trip, { eq }) => eq(trip.id, params.id),
      with: {
        participants: {
          columns: {
            id: true,
            name: true,
            email: true,
            isConfirmed: true,
          },
        },
      },
    })

    if (!trip) {
      throw new Error('Trip not found!')
    }

    return { participants: trip.participants }
  },
  {
    params: getParticipantsSchema,
  },
)
