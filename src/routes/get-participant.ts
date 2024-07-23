import { Elysia, t } from 'elysia'

import { db } from '../lib/drizzle'

const getParticipantSchema = t.Object({
  id: t.String({ format: 'uuid' }),
})

export const getParticipant = new Elysia().get(
  '/participants/:id',
  async ({ params }) => {
    const participant = await db.query.participants.findFirst({
      where: (participant, { eq }) => eq(participant.id, params.id),
      columns: {
        id: true,
        name: true,
        email: true,
        isConfirmed: true,
      },
    })

    if (!participant) {
      throw new Error('Participant not found!')
    }

    return { participant }
  },
  {
    params: getParticipantSchema,
  },
)
