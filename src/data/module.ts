import { modules,users,apiTokens } from "../database/schema"
import { db } from "../db"
import { eq,and } from "drizzle-orm"

export async function registerModule(tokenAPI: string){
  const [row] = await db.insert(modules).values({
    token_api: tokenAPI
  }).returning()

  if(!row) {
    return {valid : false, body: "Non existent token"} as const
  }
  return {valid: true , body: row!.uuid} as const
}

export async function updateModuleAlias(newConfig : {moduleUUID: string, newAlias: string}) {
  const {moduleUUID, newAlias} = newConfig
  const [row] = await db.update(modules)
  .set({ alias: newAlias })
  .where(eq(modules.uuid,moduleUUID))
  .returning()
  if(!row){
    return {valid: false, body: "Could not update alias"} as const
  }
  return {valid: true, body: row!} as const
}


export async function setModuleGroup(moduleConfig :{moduleUUID: string, groupID?: number}) {
  const [row] = await db.update(modules)
  .set({belong_group: moduleConfig.groupID})
  .where(eq(modules.uuid,moduleConfig.moduleUUID))
  .returning()
  
  if(!row) {
    return {valid: false, body: "Module does not exist"} as const
  }

  return {valid: true, body: row} as const
}


export async function userHasOwnershipOfModule(request: {userUUID:string, moduleUUID: string}){
  const [apiTokensFromUserQuery] = await db.select({module_uuid: modules.uuid}).from(modules)
  .innerJoin(apiTokens,
    and(
      eq(modules.uuid,request.moduleUUID),
      eq(modules.token_api,apiTokens.token_api)
    )
  )
  .where(eq(apiTokens.user_uuid,request.userUUID))
  
  if(!apiTokensFromUserQuery)
  {
    return false as const
  }

  return true as const
}