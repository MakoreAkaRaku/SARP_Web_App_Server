import { db } from '../db'
import { groups } from '../database/schema'
import { eq } from 'drizzle-orm'
import { createSelectSchema, createInsertSchema } from 'drizzle-typebox'
import { t, type Static } from 'elysia'


const insertGroup = createInsertSchema(groups)

const insertGroupSchema = t.Omit(insertGroup, ['id'])
type Group = Static<typeof insertGroupSchema>

export async function registerGroup(newGroup: Group) {
  try {
    const [row] = await db.insert(groups).values(newGroup).returning()
    if (!row) {
      return { valid: false, body: "Group already exists" } as const
    }
    return { valid: true, body: row } as const
  } catch (error) {
    return { valid: false, body: 'conflict' } as const
  }
}