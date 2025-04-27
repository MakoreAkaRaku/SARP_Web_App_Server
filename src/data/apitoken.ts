import { t, type Static } from "elysia"
import { apiTokens } from "../database/schema"
import { db } from "../db"
import { eq, and } from "drizzle-orm"
import { createInsertSchema } from "drizzle-typebox"

const insertSchema = createInsertSchema(apiTokens)
export const updateApiTokenSchema = t.Object({
  token_api: t.String({ format: 'uuid' })
})
type InsertApiToken = Static<typeof insertSchema>
type ApiToken = {user_uuid: string, token_api: string}

export async function registerApiToken(newApiToken: InsertApiToken) {
  const [row] = await db.insert(apiTokens).values(newApiToken).returning()

  if (!row) {
    return { valid: false, body: "Registering new Token Failed" } as const
  }
  return { valid: true, body: row.token_api } as const
}

export async function getApiTokens(user: {user_uuid: string}) {
  const apiTokenList = await db.select({token_api: apiTokens.token_api}).from(apiTokens)
  .where(eq(apiTokens.user_uuid,user.user_uuid))
  if (!apiTokenList) {
    return { valid: false, msg: "Error on Query" } as const
  }
  return { valid: true, body: apiTokenList} as const
}

export async function deleteApiToken(apiToken: {token_api: string}) {
  const [result] = await db.delete(apiTokens)
    .where(eq(apiTokens.token_api, apiToken.token_api)).returning()
  if (!result) {
    return { valid: false, msg: "Error deleting apiToken" } as const
  }
  return { valid: true, body: !result} as const
}

export async function userHasOwnershipOfApiToken(tokenAPI: ApiToken) {
  const [apiTokenUser] = await db.select({ module_uuid: apiTokens.user_uuid }).from(apiTokens)
    .where(
      and(
        eq(apiTokens.user_uuid, tokenAPI.user_uuid),
        eq(apiTokens.token_api, tokenAPI.token_api)
      )
    )

    console.log('apiTokenUser: ', apiTokenUser)
  return apiTokenUser !== undefined
}