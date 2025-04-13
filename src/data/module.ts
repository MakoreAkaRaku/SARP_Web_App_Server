import { t, type Static } from "elysia"
import { modules, apiTokens, peripherals } from "../database/schema"
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

export async function getModuleData(moduleUIID: string) {
  const [module] = await db.select()
    .from(modules)
    .where(eq(modules.uuid, moduleUIID))
  if (!module) {
    return { valid: false, msg: "Module Not Found" } as const
  }


  const modulePeripheral = await db.select()
    .from(peripherals)
    .where(eq(peripherals.parent_module,moduleUIID))

  return { valid: true, body: {module, peripherals: modulePeripheral} } as const
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