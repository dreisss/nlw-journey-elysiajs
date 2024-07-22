import { Elysia, t } from 'elysia'

import { db } from '../lib/drizzle'
import dayjs from '../lib/dayjs'
import { activities } from '../../db/schema'

const createActivityParamsSchema = t.Object({
  id: t.String({ format: 'uuid' }),
})

const createActivityBodySchema = t.Object({
  title: t.String({ minLength: 4 }),
  occursAt: t.Date({}),
})

export const createActivity = new Elysia().post(
  '/trips/:id/activities',
  async ({ params, body }) => {
    const trip = await db.query.trips.findFirst({
      where: (trip, { eq }) => eq(trip.id, params.id),
    })

    const { title, occursAt } = body

    if (!trip) {
      throw new Error('Trip not found!')
    }

    if (dayjs(occursAt).isBefore(trip.startsAt) || dayjs(occursAt).isAfter(trip.endsAt)) {
      throw new Error('Invalid activity date!')
    }

    return await db
      .insert(activities)
      .values({
        title,
        occursAt,
        tripId: trip.id,
      })
      .returning({ id: activities.id })
  },
  {
    params: createActivityParamsSchema,
    body: createActivityBodySchema,
  },
)
