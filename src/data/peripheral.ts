import { t, type Static } from "elysia"
import {peripheralTypes, apiTokens, peripherals, modules, datas } from "../database/schema"
import { db } from "../db"
import { eq, and, lt, gt } from "drizzle-orm"
import { createInsertSchema } from "drizzle-typebox"

const registeringSchema = createInsertSchema(peripherals)

export const registerPeripheralSchema =  t.Omit(registeringSchema,['id'])

type RegisterSchema = Static<typeof registeringSchema>

export const registerDataSchema = t.Union([
  t.Object({
    data_type: t.Literal("boolean"),
    value: t.Boolean()
  }),
  t.Object({
    data_type: t.Literal("integer"),
    value: t.Number()
  }),
  t.Object({
    data_type: t.Literal("decimal"),
    value: t.Number()
  }),
])

type RegisterData = Static<typeof registerDataSchema>


export async function registerPeripheral(peripheral_data: RegisterSchema) {
  const [row] = await db.insert(peripherals)
  .values(peripheral_data)
  .returning()

  if (!row) {
    return { valid: false, body: "Non existent module" } as const
  }
  return { valid: true, body: row } as const

}

export async function getPeripheralData(peripheral_id: number,timelapse: {begin: Date, end: Date}) {
  const peripheralData = await db.select()
  .from(peripherals)
  .innerJoin(datas, eq(datas.peripheral_id,peripherals.id))
  .where(
    and(
      eq(peripherals.id, peripheral_id),
      lt(datas.registered_at, timelapse.begin),
      gt(datas.registered_at, timelapse.end)
    )
  )

  if (!peripheralData) {
    return { valid: false, msg: "Error on Query" } as const
  }
  return { valid: true, body: peripheralData} as const
}

export async function userHasOwnershipOfPeripheral(request: { userUUID: string, peripheralID: number }) {
  const [apiTokensFromPeripheralIDQuery] = await db.select({ module_uuid: modules.uuid }).from(peripherals)
  .innerJoin(
    modules,
    eq(modules.uuid, peripherals.parent_module)
  )  
  .innerJoin(apiTokens,
      eq(modules.token_api, apiTokens.token_api)
    )
    .where(
      and(
        eq(apiTokens.user_uuid, request.userUUID),
        eq(peripherals.id, request.peripheralID)
      )
    )
  return !apiTokensFromPeripheralIDQuery
}

export async function registerPeripheralData(newData: {peripheral_id: number} & RegisterData) {

  const [row] = await db.insert(datas)
  .values(newData)
  .returning()

  if (!row) {
    return { valid: false, body: "Non existent module" } as const
  }
  return { valid: true, body: row } as const

}