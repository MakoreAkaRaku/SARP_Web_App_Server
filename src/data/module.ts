import { t, type Static } from "elysia"
import { modules, apiTokens, peripherals, groups } from "../database/schema"
import { db } from "../db"
import { eq, and, getTableColumns } from "drizzle-orm"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-typebox"
export const selectModuleSchema = createSelectSchema(modules)

export type Module = Static<typeof selectModuleSchema>

export const selectModuleWithGroupNameSchema = t.Object({
  uuid: t.String({ format: 'uuid' }),
  alias: t.String(),
  last_seen: t.Union([t.Date(), t.Null()]),
  group_name: t.Union([t.String(), t.Null()]),
  belong_group: t.Union([t.Integer(), t.Null()]),
  token_api: t.String({ format: 'uuid' }),
})
export type ModuleTable = Static<typeof selectModuleWithGroupNameSchema>


const insertSchema = createInsertSchema(modules)
export const registerModuleSchema = t.Omit(insertSchema, [])
type InsertModuleInput = Static<typeof insertSchema>

const updateSchema = createUpdateSchema(modules, {
  belong_group: t.Numeric(),
})

export const updateModuleSchema = t.Omit(updateSchema, ['uuid', 'last_seen'])

// belong_group: number. Which must be mapped to null if value is -1
type UpdateModuleRequest = Static<typeof updateModuleSchema>
// Remove the property "belong_group" (omit it) and then replace it with the desired type (number | null)
type UpdateModuleInput = Omit<UpdateModuleRequest, 'belong_group'> & {
  belong_group: number | null
}

export async function registerModule(registerInfo: InsertModuleInput) {
  const [row] = await db.insert(modules).values(registerInfo).returning()

  if (!row) {
    return { valid: false, body: "Non existent token" } as const
  }
  return { valid: true, body: row.uuid } as const
}

export async function getModules(user: { uuid: string }) {
  const moduleList = await db.select({
    ...getTableColumns(modules),
    group_name: groups.group_name,
  })
    .from(modules)
    .innerJoin(
      apiTokens,
      eq(apiTokens.token_api, modules.token_api)
    )
    .leftJoin(
      groups,
      eq(groups.id, modules.belong_group)
    )
    .where(eq(apiTokens.user_uuid, user.uuid))

  if (!moduleList) {
    return { valid: false, msg: "Error fetching modules" } as const
  }
  return { valid: true, body: moduleList } as const
}

export async function getModule(module: { uuid: string }, user: { uuid: string }) {
  const [moduleSpecs] = await db.select({ ...getTableColumns(modules) })
    .from(modules)
    .innerJoin(
      apiTokens,
      eq(modules.token_api, apiTokens.token_api)
    )
    .where(
      and(
        eq(modules.uuid, module.uuid),
        eq(apiTokens.user_uuid, user.uuid)
      ))
  if (!moduleSpecs) {
    return { valid: false, msg: "Module Not Found" } as const
  }
  return { valid: true, body: moduleSpecs } as const
}


export async function updateModule(module: {uuid: string}, updatedFields: UpdateModuleInput) {
  const [row] = await db.update(modules)
    .set(updatedFields)
    .where(eq(modules.uuid, module.uuid))
    .returning()

  if (!row) {
    return { valid: false, msg: "Failed to update" } as const
  }

  return { valid: true, body: row } as const
}


export async function userHasOwnershipOfModule(user: { uuid: string}, module: {uuid: string}) {
  const [apiTokensFromModuleUUIDQuery] = await db.select({ module_uuid: modules.uuid }).from(modules)
    .innerJoin(apiTokens,
      eq(modules.token_api, apiTokens.token_api)
    )
    .where(
      and(
        eq(apiTokens.user_uuid, user.uuid),
        eq(modules.uuid, module.uuid)
      )
    )
  return apiTokensFromModuleUUIDQuery !== undefined
}