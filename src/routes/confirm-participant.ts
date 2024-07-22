import { eq } from 'drizzle-orm'
import { Elysia, t } from 'elysia'

import { appBaseUrl } from '..'
import { participants } from '../../db/schema'
import { db } from '../lib/drizzle'

const confirmTripSchema = t.Object({
  id: t.String({ format: 'uuid' }),
})

export const confirmParticipant = new Elysia().get(
  '/participants/:id/confirm',
  async ({ params, redirect }) => {
    const participant = await db.query.participants.findFirst({
      where: (participant, { eq }) => eq(participant.id, params.id),
    })

    if (!participant) {
      throw Error('Participant not found!')
    }

    if (participant.isConfirmed) {
      return redirect(`http://${appBaseUrl}/trips/${participant.tripId}`)
    }

    await db.update(participants).set({ isConfirmed: true }).where(eq(participants.id, participant.id))
  },
  { params: confirmTripSchema },
)
