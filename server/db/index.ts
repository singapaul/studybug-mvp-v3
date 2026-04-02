import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'
import type { ExtractTablesWithRelations } from 'drizzle-orm'
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })

// Use the PgDatabase base type so both NeonHttpDatabase and PgliteDatabase
// (used in tests) satisfy this type without casting.
export type DB = PgDatabase<
  PgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>
