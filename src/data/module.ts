import { t, type Static } from "elysia"
import { modules, apiTokens, peripherals, groups } from "../database/schema"
import { db } from "../db"
import { eq, and } from "drizzle-orm"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-typebox"
import { peripheral } from "../api/peripherals"

export const moduleIdSchema = t.Object({
  id: t.String({ format: "uuid" })
})

export const modulesSchema = t.Array(t.Object(
  {
    uuid: t.String({ format: "uuid" }),
    alias: t.String(),
    last_seen: t.Union([t.Date(),t.Null()]),
    group_name: t.Union([t.String(),t.Null()]),
    belong_group: t.Union([t.Integer(),t.Null()]),
    token_api: t.String({ format: "uuid" })
  }
))

export type Modules = Static<typeof modulesSchema>

export const selectModuleSchema = t.Array(t.Object({
  uuid: t.String({ format: "uuid" }),
    alias: t.String(),
    last_seen: t.Union([t.Date(),t.Null()]),
    belong_group: t.Union([t.Number(),t.Null()]),
    token_api: t.String({ format: "uuid" }),
    peripheral_id: t.Union([t.Number(), t.Null()]),
    peripheral_type:t.Union([t.String(),t.Null()]),
    peripheral_descr: t.Union([t.String(),t.Null()])
}))

const insertSchema = createInsertSchema(modules)
export const registerModuleSchema = t.Omit(insertSchema, [])
type InsertModuleInput = Static<typeof insertSchema>

const updateSchema = createUpdateSchema(modules)

export const updateModuleSchema = t.Omit(updateSchema, ['uuid', 'last_seen'])

type UpdateModuleInput = Static<typeof updateModuleSchema>

export async function registerModule(registerInfo: InsertModuleInput) {
  const [row] = await db.insert(modules).values(registerInfo).returning()

  if (!row) {
    return { valid: false, body: "Non existent token" } as const
  }
  return { valid: true, body: row.uuid } as const
}

export async function getModules(user: { uuid: string }) {
  const moduleList = await db.select({
    uuid: modules.uuid,
    alias: modules.alias,
    last_seen: modules.last_seen,
    group_name: groups.group_name,
    belong_group: modules.belong_group,
    token_api: modules.token_api,
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

export async function getModule(module: { uuid: string }) {
  const moduleSpecs = await db.select({
    uuid: modules.uuid,
    alias: modules.alias,
    last_seen: modules.last_seen,
    belong_group: modules.belong_group,
    token_api: modules.token_api,
    peripheral_id: peripherals.id,
    peripheral_type: peripherals.peripheral_type,
    peripheral_descr: peripherals.short_descr,
  })
    .from(modules)
    .leftJoin(
      peripherals,
      eq(modules.uuid, peripherals.parent_module)
    )
    .where(eq(modules.uuid, module.uuid))
  if (!module) {
    return { valid: false, msg: "Module Not Found" } as const
  }
  return { valid: true, body: moduleSpecs } as const
}


export async function updateModule(moduleUIID: string, updatedFields: UpdateModuleInput) {
  const [row] = await db.update(modules)
    .set(updatedFields)
    .where(eq(modules.uuid, moduleUIID))
    .returning()

  if (!row) {
    return { valid: false, msg: "Failed to update" } as const
  }

  return { valid: true, body: row } as const
}


export async function userHasOwnershipOfModule(request: { userUUID: string, moduleUUID: string }) {
  const [apiTokensFromModuleUUIDQuery] = await db.select({ module_uuid: modules.uuid }).from(modules)
    .innerJoin(apiTokens,
      eq(modules.token_api, apiTokens.token_api)
    )
    .where(
      and(
        eq(apiTokens.user_uuid, request.userUUID),
        eq(modules.uuid, request.moduleUUID)
      )
    )
  return apiTokensFromModuleUUIDQuery !== undefined
}