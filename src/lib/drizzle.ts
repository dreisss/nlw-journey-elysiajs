import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

import * as schema from '../../db/schema'

let client: postgres.Sql

if (process.env.NODE_ENV === 'production') {
  client = postgres(process.env.DB_URL as string)
} else {
  client = postgres(process.env.DB_URL as string, { max: 1 })
}

export const db = drizzle(client, { schema })

migrate(db, { migrationsFolder: './db/migrations' })
