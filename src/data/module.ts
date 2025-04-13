import { t, type Static } from "elysia"
import { modules, apiTokens, peripherals, groups } from "../database/schema"
import { db } from "../db"
import { eq, and } from "drizzle-orm"
import { createUpdateSchema } from "drizzle-typebox"

export const moduleIdSchema = t.Object({
  id: t.String({ format: "uuid" })
})


const moduleSchema = createUpdateSchema(modules)

export const updateModuleSchema = t.Omit(moduleSchema, ['uuid', 'last_seen'])

type UpdateModuleInput = Static<typeof updateModuleSchema>

export async function registerModule(tokenAPI: string) {
  const [row] = await db.insert(modules).values({
    token_api: tokenAPI
  }).returning()

  if (!row) {
    return { valid: false, body: "Non existent token" } as const
  }
  return { valid: true, body: row!.uuid } as const
}

export async function getModulesByGroup(user_uuid: string,group_id: number) {
  const moduleList = await db.select()
  .from(groups)
  .innerJoin(
    modules,
    eq(modules.belong_group,groups.id)
  )
  .innerJoin(
    apiTokens,
    eq(apiTokens.token_api,modules.token_api)
  )
  .where(
    and(
      eq(groups.id,group_id),
      eq(apiTokens.user_uuid,user_uuid)
    )
  )
  if (!moduleList) {
    return { valid: false, msg: "Error on Query" } as const
  }
  return { valid: true, body: moduleList} as const
}

export async function getModules(user_uuid: string) {
  const moduleList = await db.select({modules, group_name: groups.group_name})
    .from(modules)
    .innerJoin(
      apiTokens,
      eq(apiTokens.token_api,modules.token_api)
    )
    .leftJoin(
      groups,
      eq(groups.id,modules.belong_group)
    )
    .where(eq(apiTokens.user_uuid, user_uuid))
    
  if (!moduleList) {
    return { valid: false, msg: "Error fetching modules" } as const
  }
  return { valid: true, body: moduleList} as const
}

export async function getModule(moduleUIID: string) {
  const [module] = await db.select()
    .from(modules)
    .where(eq(modules.uuid, moduleUIID))
  if (!module) {
    return { valid: false, msg: "Module Not Found" } as const
  }
  return { valid: true, body: module} as const
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
  const [apiTokensFromUserQuery] = await db.select({ module_uuid: modules.uuid }).from(modules)
    .innerJoin(apiTokens,
      eq(modules.token_api, apiTokens.token_api)
    )
    .where(
      and(
        eq(apiTokens.user_uuid, request.userUUID),
        eq(modules.uuid, request.moduleUUID)
      )
    )
  return !apiTokensFromUserQuery
}