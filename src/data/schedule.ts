import type { Static } from "elysia"
import { schedules } from "../database/schema"
import { db } from "../db"
import parser from 'cron-parser'
import { createInsertSchema, createSelectSchema } from "drizzle-typebox"

const scheduleInsertSchema = createInsertSchema(schedules)
type Schedule = Static<typeof scheduleInsertSchema>

export async function createSchedule(user: { uuid: string }, scheduleData: Schedule) {
  const [row] = await db.insert(schedules)
    .values(scheduleData)
    .returning()

  if (!row) {
    return { valid: false, body: "Error creating rule" } as const
  }
  return { valid: true, body: row } as const
}


export function shouldRunNow(cronExpr: string, currentDate: Date) {
  try {

    const interval = parser.parse(cronExpr,{ currentDate: currentDate});
    const now = new Date();
    const prev = interval.prev().toDate();
    const next = interval.next().toDate();
    const obj = {prev,now,next,currentDate}
    console.log(obj)

    // If "now" is within ±30 seconds of either the previous or next execution time
    const bufferMs = 30 * 100;


    return now.getTime() > next.getTime()
//    const diffNext = now.getTime() - next.getTime()

    // console.log(diffPrev, diffNext)
    // return (
    //   Math.abs(diffPrev) < bufferMs ||
    //   Math.abs(diffNext) < bufferMs
    // );
  } catch (error) {
    console.error('Invalid cron expression: ', error);
    return false;
  }
}