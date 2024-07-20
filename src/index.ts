import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

import { createTrip } from './routes/create-trip'
import { confirmTrip } from './routes/confirm-trip'

const corsPlugin = cors({
  origin: '*',
})

export const app = new Elysia().use(corsPlugin).use(createTrip).use(confirmTrip).listen(3000)
export const baseUrl = `${app.server?.hostname}:${app.server?.port}`

console.log(`🦊 Elysia is running at ${baseUrl}`)
