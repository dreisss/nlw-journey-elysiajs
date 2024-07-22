import { Elysia, t } from 'elysia'

import { db } from '../lib/drizzle'

const getLinksSchema = t.Object({
  id: t.String({ format: 'uuid' }),
})

export const getLinks = new Elysia().get(
  '/trips/:id/links',
  async ({ params }) => {
    const trip = await db.query.trips.findFirst({
      where: (trip, { eq }) => eq(trip.id, params.id),
      with: {
        links: true,
      },
    })

    if (!trip) {
      throw new Error('Trip not found!')
    }

    return { links: trip.links }
  },
  { params: getLinksSchema },
)
