import Elysia, { t, error } from "elysia";
import { registerModule, moduleIdSchema, updateModuleSchema, userHasOwnershipOfModule, updateModule, getModule, getModules } from "../../data/module"
import { peripheral } from "./peripheral";
import { jwtMiddleware } from "../middleware/jwtMiddleware";
import { hasAdminRole } from "../../data/user";

export const module = new Elysia({ prefix: '/module' })
  .post('/register', async ({ body }) => {
    const { tokenAPI } = body
    const result = await registerModule(tokenAPI)
    if (!result.valid) {
      console.error("/module/register failed")
      return error(401, "This token has already expired or is not correct")
    }
    return Response.json({ moduleToken: result.body }, { status: 201 })
  }
    ,
    {
      body: t.Object({
        tokenAPI: t.String({ format: 'uuid' })
      })
    })
  .use(peripheral)
  .use(jwtMiddleware)
  .get('/', async ({ params, jwtPayload }) => {
    const { uuid: user_uuid } = jwtPayload
    const result = await getModules(user_uuid)
    if (!result.valid) {
      return error(404, result.msg)
    }
    return result.body
  })
  .guard(
    {
      params: moduleIdSchema,
      beforeHandle: async ({ jwtPayload, params }) => {
        const config = { userUUID: jwtPayload.uuid, moduleUUID: params.id }
        if (!hasAdminRole(jwtPayload)) {
          const hasOwnership = await userHasOwnershipOfModule(config)
          if (!hasOwnership) return error(401)
        }
      }
    },
    (app) => app
      .get('/:id', async ({ params }) => {
        const result = await getModule(params.id)
        if (!result.valid)
          return error(404, result.msg)
        return result.body
      })
      .put('/:id', async ({ params, body }) => {
        const result = await updateModule(params.id, body)
        if (!result.valid) {
          return error(404, result.msg)
        }
        return result.body
      },
        {
          body: updateModuleSchema
        })
  )