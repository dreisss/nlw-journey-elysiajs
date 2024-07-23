import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'

import { confirmParticipant } from './routes/confirm-participant'
import { confirmTrip } from './routes/confirm-trip'
import { createActivity } from './routes/create-activity'
import { createInvite } from './routes/create-invite'
import { createLink } from './routes/create-link'
import { createTrip } from './routes/create-trip'
import { getActivities } from './routes/get-activities'
import { getLinks } from './routes/get-links'
import { getParticipant } from './routes/get-participant'
import { getParticipants } from './routes/get-participants'
import { getTripDetails } from './routes/get-trip-details'
import { updateTrip } from './routes/update-trip'

const corsPlugin = cors({
  origin: '*',
})

export const app = new Elysia()
  .use(corsPlugin)
  .use(createInvite)
  .use(createTrip)
  .use(confirmTrip)
  .use(updateTrip)
  .use(getTripDetails)
  .use(confirmParticipant)
  .use(getParticipants)
  .use(getParticipant)
  .use(createActivity)
  .use(getActivities)
  .use(createLink)
  .use(getLinks)
  .listen(process.env.PORT)

console.log(`🦊 Elysia is running at ${process.env.BASE_URL}`)
