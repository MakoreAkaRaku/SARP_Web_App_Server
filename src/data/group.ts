import { db } from '../db'
import { groups } from '../database/schema'
import { eq, and, type Update } from 'drizzle-orm'
import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-typebox'
import { t, type Static } from 'elysia'
import { group } from '../api/group'


const insertSchema = createInsertSchema(groups)
const selectSchema = createSelectSchema(groups)
const updateSchema = createUpdateSchema(groups, {id: t.Integer()})

export const insertGroupSchema = t.Omit(insertSchema, ['id'])
export type Group = Static<typeof selectSchema>
type InsertGroupSchema = Static<typeof insertGroupSchema>

export const updateGroupSchema = t.Omit(updateSchema, ['group_name', 'owner_group'])
type DeleteGroupSchema = Static<typeof updateSchema>

export async function registerGroup(newGroup: InsertGroupSchema) {
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

export async function getGroups(user: { uuid: string }) {
  const groupList = await db.select().from(groups).where(eq(groups.owner_group, user.uuid))
  if (!groupList) {
    return { valid: false, msg: "Error on Query" } as const
  }
  return { valid: true, body: groupList } as const
}

export async function getGroup(user: { uuid: string }, group: { id: number}) {
  const groupList = await db.select().from(groups).where(
    and(
      eq(groups.id, group.id),
      eq(groups.owner_group, user.uuid)
    ))
  if (!groupList) {
    return { valid: false, msg: "Error on Query" } as const
  }
  return { valid: true, body: groupList } as const
}

export async function deleteGroup(removedGroup: DeleteGroupSchema) {
  try {
    const [row] = await db.delete(groups)
    .where(
      eq(groups.id,removedGroup.id)
    ).returning()
    if (!row) {
      return { valid: false, body: "Group already exists" } as const
    }
    return { valid: true, body: row } as const
  } catch (error) {
    return { valid: false, body: 'conflict' } as const
  }
}