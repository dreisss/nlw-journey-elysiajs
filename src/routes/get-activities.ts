import { Elysia, t } from 'elysia'

import dayjs from '../lib/dayjs'
import { db } from '../lib/drizzle'

const getActivitiesSchema = t.Object({
  id: t.String({ format: 'uuid' }),
})

export const getActivities = new Elysia().get(
  '/trips/:id/activities',
  async ({ params }) => {
    const trip = await db.query.trips.findFirst({
      where: (trip, { eq }) => eq(trip.id, params.id),
      with: {
        activities: {
          orderBy: (activity, { asc }) => [asc(activity.occursAt)],
        },
      },
    })

    if (!trip) {
      throw new Error('Trip not found!')
    }

    const differenceBetweenTripStartAndEnd = dayjs(trip.endsAt).diff(trip.startsAt, 'days')

    return Array.from({ length: differenceBetweenTripStartAndEnd + 1 }).map((_, index) => {
      const date = dayjs(trip.startsAt).add(index, 'days')

      return {
        date: date.toDate(),
        activities: trip.activities.filter((activity) => dayjs(activity.occursAt).isSame(date, 'day')),
      }
    })
  },
  { params: getActivitiesSchema },
)
