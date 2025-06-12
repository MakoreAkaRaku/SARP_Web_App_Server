import { t, type Static } from "elysia"
import { peripheralTypes, apiTokens, peripherals, modules, datas, peripheralStates } from "../database/schema"
import { db } from "../db"
import { eq, and, lt, gt, getTableColumns } from "drizzle-orm"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-typebox"

const registeringSchema = createInsertSchema(peripherals)
export const registerDataSchema = createInsertSchema(datas)

const selectPeripheralSchema = createSelectSchema(peripherals, {id: t.Numeric()})

export const updatePeripheral = t.Omit(selectPeripheralSchema, ['parent_module', 'peripheral_type'])

export const registerPeripheralSchema = t.Omit(registeringSchema, ['id'])

const registerPeripheralStateSchema = createInsertSchema(peripheralStates)

type PeripheralState = Static<typeof registerPeripheralStateSchema>
type PeripheralSchema = Static<typeof registeringSchema>
type UpdatePeripheral = Static<typeof updatePeripheral>
export type PeripheralData = Static<typeof registerDataSchema>
export type Peripheral = Static<typeof selectPeripheralSchema>

export async function registerPeripheral(peripheral_data: PeripheralSchema) {
  const [row] = await db.insert(peripherals)
    .values(peripheral_data)
    .returning()

  if (!row) {
    return { valid: false, body: "Non existent module" } as const
  }

  const originalState : PeripheralState = {peripheral_id: row.id}
  await db.insert(peripheralStates).values(originalState)
  
  return { valid: true, body: row } as const
}

export async function getModulePeripherals(user: { uuid: string }, module: { uuid: string }) {
  const moduleperipherals = await db.select({
    ...getTableColumns(peripherals)
  })
    .from(peripherals)
    .innerJoin(
      modules,
      eq(modules.uuid, peripherals.parent_module)
    )
    .innerJoin(
      apiTokens,
      eq(apiTokens.token_api, modules.token_api)
    )
    .where(
      and(
        eq(modules.uuid, module.uuid),
        eq(apiTokens.user_uuid, user.uuid)
      )
    )

  if (!moduleperipherals) {
    return { valid: false, msg: "Error fetching peripheral" } as const
  }
  return { valid: true, body: moduleperipherals } as const

}

export async function getPeripheralData(peripheral_id: number, timelapse: { begin: Date, end: Date }) {
  const peripheralData = await db.select()
    .from(peripherals)
    .innerJoin(datas, eq(datas.peripheral_id, peripherals.id))
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
  return { valid: true, body: peripheralData } as const
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

export async function registerPeripheralData(data: PeripheralData) {

  const [row] = await db.insert(datas)
    .values(data)
    .returning()

  if (!row) {
    return { valid: false, msg: "Non existent module" } as const
  }
  return { valid: true, body: row } as const

}

export async function updatePeripheralSpecs(peripheral: UpdatePeripheral) {
  return db.update(peripherals)
    .set(peripheral)
    .where(
      eq(peripherals.id, peripheral.id)
    )
    .returning()
    .then((rows) => {
      if (rows.length === 0) {
        return { valid: false, msg: "Peripheral not found" } as const
      }
      return { valid: true, body: rows[0] } as const
    })
}

export async function updatePeripheralState(peripheral: Peripheral, newState: PeripheralState) {

}