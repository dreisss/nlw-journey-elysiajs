import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

import { createTrip } from './routes/create-trip'
import { confirmTrip } from './routes/confirm-trip'
import { confirmParticipant } from './routes/confirm-participant'
import { createActivity } from './routes/create-activity'
import { getActivities } from './routes/get-activities'
import { createLink } from './routes/create-link'
import { getLinks } from './routes/get-links'

const corsPlugin = cors({
  origin: '*',
})

export const app = new Elysia()
  .use(corsPlugin)
  .use(createTrip)
  .use(confirmTrip)
  .use(confirmParticipant)
  .use(createActivity)
  .use(getActivities)
  .use(createLink)
  .use(getLinks)
  .listen(3000)
export const apiBaseUrl = `${app.server?.hostname}:${app.server?.port}`
export const appBaseUrl = ''

console.log(`🦊 Elysia is running at ${apiBaseUrl}`)
