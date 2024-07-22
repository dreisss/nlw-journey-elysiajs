import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

import { createTrip } from './routes/create-trip'
import { confirmTrip } from './routes/confirm-trip'
import { confirmParticipant } from './routes/confirm-participant'

const corsPlugin = cors({
  origin: '*',
})

export const app = new Elysia().use(corsPlugin).use(createTrip).use(confirmTrip).use(confirmParticipant).listen(3000)
export const apiBaseUrl = `${app.server?.hostname}:${app.server?.port}`
export const appBaseUrl = ''

console.log(`🦊 Elysia is running at ${apiBaseUrl}`)
