import { error, t, type Static } from "elysia"
import { apiTokens, modules, peripherals, schedules } from "../database/schema"
import { db } from "../db"
import parser from 'cron-parser'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-typebox"
import { eq, getTableColumns } from "drizzle-orm"


export const scheduleInsertSchema = createInsertSchema(schedules)
export const scheduleSelectSchema = createSelectSchema(schedules)
export const scheduleUpdateSchema = createUpdateSchema(schedules, { id: t.Number() })
export type ScheduleSelect = Static<typeof scheduleSelectSchema>
export type Schedule = Static<typeof scheduleInsertSchema>
export type ScheduleUpdate = Static<typeof scheduleUpdateSchema>

export async function createSchedule(scheduleData: Schedule) {
  const [row] = await db
    .insert(schedules)
    .values(scheduleData)
    .returning()

  if (!row) {
    return { valid: false, body: "Error creating schedule" } as const
  }
  return { valid: true, body: row } as const
}

export async function deleteSchedule(scheduleData: ScheduleUpdate) {

  const [result] = await db.delete(schedules)
    .where(
      eq(schedules.id, scheduleData.id)
    ).returning()

  if (!result) {
    return { valid: false, body: "Couldn't be deleted" } as const
  }
  return { valid: true, body: result } as const
}

export async function updateSchedule(scheduleData: ScheduleUpdate) {
  const [row] = await db
    .update(schedules)
    .set(scheduleData)
    .where(
      eq(schedules.id, scheduleData.id)
    )
    .returning()

  if (!row) {
    return { valid: false, body: "Error creating schedule" } as const
  }
  return { valid: true, body: row } as const
}

export async function getSchedules() {
  let query = undefined
  try {
    query = await db.select().from(schedules)
  } catch (error) {
    console.error('Error getting all schedules: ', error)
    return { valid: false, message: error } as const
  }
  
  if (query) {
    return { valid: true, body: query } as const
  }

  return { valid: false, body: "Getting all schedules failed" } as const
}

export async function getUserSchedules(user: { uuid: string }) {
  try {
    const query = await db.select(getTableColumns(schedules))
      .from(schedules)
      .innerJoin(peripherals,
        eq(schedules.peripheral_id, peripherals.id)
      )
      .innerJoin(modules,
        eq(modules.uuid, peripherals.parent_module)
      )
      .innerJoin(apiTokens,
        eq(apiTokens.token_api, modules.token_api)
      )
      .where(
        eq(apiTokens.user_uuid, user.uuid)
      )
    if (query) {
      return { valid: true, body: query } as const
    }

  } catch (error) {
    console.error('Error getting all schedules: ', error)
    return { valid: false, message: error } as const
  }
  return { valid: false, message: "Something went wrong" } as const
}

export function shouldRunNow(cronExpr: string, lastRunDate: Date) {
  try {

    const interval = parser.parse(cronExpr, { currentDate: lastRunDate });
    const now = new Date();
    const prev = interval.prev().toDate();
    const next = interval.next().toDate();
    const obj = { prev, now, next, currentDate: lastRunDate }
    console.log(obj)
    return now.getTime() > next.getTime()

  } catch (error) {
    console.error('Invalid cron expression: ', error);
    return false;
  }
}