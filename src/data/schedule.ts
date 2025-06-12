import type { Static } from "elysia"
import { schedules } from "../database/schema"
import { db } from "../db"
import { eq, getTableColumns } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from "drizzle-typebox"

const scheduleInsertSchema = createInsertSchema(schedules)
type Schedule = Static<typeof scheduleInsertSchema>

export async function createSchedule(user: {uuid: string}, scheduleData: Schedule) {
  const [row] = await db.insert(schedules)
    .values(scheduleData)
    .returning()

  if (!row) {
    return { valid: false, body: "Error creating rule" } as const
  }
  return { valid: true, body: row } as const
}