import { Elysia, t } from 'elysia'

const confirmTripSchema = t.Object({
  id: t.String({ format: 'uuid' }),
})

export const confirmTrip = new Elysia().get(
  '/trips/:id/confirm',
  async ({ params }) => {
    return { id: params.id }
  },
  { params: confirmTripSchema },
)
