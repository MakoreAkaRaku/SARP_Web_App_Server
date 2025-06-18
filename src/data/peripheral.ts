import { t, type Static } from "elysia"
import { peripheralTypes, apiTokens, peripherals, modules, datas, peripheralStates, pTypes } from "../database/schema"
import { db } from "../db"
import { eq, and, lt, gt, getTableColumns, lte, gte, desc, inArray } from "drizzle-orm"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-typebox"

const registeringSchema = createInsertSchema(peripherals)
export const registerDataSchema = createInsertSchema(datas)

export const selectPeripheralSchema = createSelectSchema(peripherals, { id: t.Numeric() })

export const updatePeripheral = t.Omit(selectPeripheralSchema, ['parent_module', 'p_type'])

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
    .orderBy(peripherals.id)

  if (!moduleperipherals) {
    return { valid: false, msg: "Error fetching peripheral" } as const
  }
  return { valid: true, body: moduleperipherals } as const

}

export async function getPeripheralDataType(requestedPeripheral: { id: number }) {
  const [request] = await db.select(getTableColumns(pTypes))
    .from(pTypes)
    .innerJoin(
      peripherals,
      eq(pTypes.type, peripherals.p_type)
    )
    .where(eq(peripherals.id, requestedPeripheral.id))
  return request
}

export async function getPeripheralData(peripheral_id: number, timelapse: { begin?: Date, end?: Date }) {

  const datasCols = getTableColumns(datas)
  const peripheralData = timelapse.begin !== undefined && timelapse.end !== undefined ?
    await db.select(datasCols)
      .from(peripherals)
      .innerJoin(datas, eq(datas.peripheral_id, peripherals.id))
      .where(
        and(
          eq(peripherals.id, peripheral_id),
          gte(datas.registered_at, timelapse.begin),
          lte(datas.registered_at, timelapse.end)
        )
      )
      .orderBy(datas.registered_at)
    :
    await db.select(datasCols)
      .from(peripherals)
      .innerJoin(datas, eq(datas.peripheral_id, peripherals.id))
      .where(
        eq(peripherals.id, peripheral_id)
      )
      .orderBy(desc(datas.registered_at))
      .limit(30)
  const [peripheral] = await db.select()
    .from(peripherals)
    .where(eq(peripherals.id, peripheral_id))
  if (!peripheralData) {
    return { valid: false, msg: "Error on Query" } as const
  }
  const values = peripheralData.map(data => data.value)
  const dates = peripheralData.map(data => data.registered_at)
  const formattedResponse = {
    peripheral: peripheral,
    data: {
      values: timelapse.begin !== undefined && timelapse.end !== undefined ? values : values.reverse(),
      dates: timelapse.begin !== undefined && timelapse.end !== undefined ? dates : dates.reverse()
    }
  }
  return { valid: true, body: formattedResponse } as const
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
  return apiTokensFromPeripheralIDQuery !== undefined
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

export async function getPeripheralState(peripheral_id: number) {
  const [result] = await db.select()
  .from(peripheralStates)
  .where(
    eq(peripheralStates.peripheral_id,peripheral_id)
  )

  if(!result){
    return {valid:false, body: "Could not get the peripheral state"} as const
  }

  return {valid:true, body: result} as const
}

export async function updatePeripheralState(pState: PeripheralState) {
  const [result] = await db.update(peripheralStates)
    .set(pState)
    .where(eq(peripheralStates.peripheral_id, pState.peripheral_id))
    .returning()

  if (result === undefined) {
    return { valid: false, body: "Something went wrong updating peripheral State" } as const
  }

  return { valid: true, body: result } as const
}

export async function getPeripheralStatesFromStateOn() {

  const result = await db.select()
    .from(peripheralStates)
    .where(
      eq(peripheralStates.state, 'on')
    )

  return { valid: true, body: result } as const
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