import { Elysia, t } from 'elysia'

import { db } from '../lib/drizzle'
import { links } from '../../db/schema'

const createLinkParamsSchema = t.Object({
  id: t.String({ format: 'uuid' }),
})

const createLinkBodySchema = t.Object({
  title: t.String({ minLength: 4 }),
  url: t.String({ format: 'uri' }),
})

export const createLink = new Elysia().post(
  '/trips/:id/links',
  async ({ params, body }) => {
    const trip = await db.query.trips.findFirst({
      where: (trip, { eq }) => eq(trip.id, params.id),
    })

    if (!trip) {
      throw new Error('Trip not found!')
    }

    const { title, url } = body

    const link = (
      await db
        .insert(links)
        .values({
          title,
          url,
          tripId: trip.id,
        })
        .returning({ id: links.id })
    )[0]

    return { id: link.id }
  },
  {
    params: createLinkParamsSchema,
    body: createLinkBodySchema,
  },
)
