import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from '../db/schema'

// const migrationClient = postgres(process.env.DB_URL as string, { max: 1 })
// migrate(drizzle(migrationClient), '')

const queryClient = postgres(process.env.DB_URL as string)
export const db = drizzle(queryClient, { schema })
