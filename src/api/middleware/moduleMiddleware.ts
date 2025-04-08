import Elysia, {t} from "elysia"
import { jwtMiddleware } from "./jwtMiddleware"
import { userHasOwnershipOfModule } from "../../data/module";
import {hasAdminRole} from "../../data/user";


export const moduleMiddleware = new Elysia()
.use(jwtMiddleware)
.guard({
  as: 'scoped',
  body: t.Object({
    moduleUUID: t.String({format: "uuid"})
  })
})
.resolve({as: 'scoped' },async ({jwtPayload, body}) => {
  const moduleUUID = body.moduleUUID; //guard and resolve do not work together pretty well... guess i'll have to put something in between
  const config = {userUUID: jwtPayload.uuid, moduleUUID: moduleUUID}
  if(hasAdminRole(jwtPayload)){
    return true
  }
  const hasOwnership = await userHasOwnershipOfModule(config)
  return hasOwnership
})
.as("plugin")
