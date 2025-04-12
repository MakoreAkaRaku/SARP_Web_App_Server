import Elysia, { t, error } from "elysia"
import { jwtMiddleware } from "./jwtMiddleware"
import { userHasOwnershipOfModule } from "../../data/module";
import { hasAdminRole } from "../../data/user";

export const moduleBodySchema = t.Object({
  moduleUUID: t.String({ format: "uuid" })
})

export const moduleMiddleware = new Elysia()
  .use(jwtMiddleware)
  .guard({
    as: 'scoped',
    body: moduleBodySchema,
    beforeHandle: async ({ jwtPayload, body }) => {
      const { moduleUUID } = body
      const config = { userUUID: jwtPayload.uuid, moduleUUID: moduleUUID }
      if (!hasAdminRole(jwtPayload)) {
        const hasOwnership = await userHasOwnershipOfModule(config)
        if (!hasOwnership) return error(401)
      }
    }
  })
  .as("plugin")
