import Elysia, { t, error } from "elysia";
import { moduleSchema, registerModule, moduleIdSchema, updateModuleSchema, userHasOwnershipOfModule, updateModule, getModule, getModules, registerModuleSchema } from "../data/module"
import { jwtMiddleware } from "./middleware/jwtMiddleware";
import { hasAdminRole } from "../data/user";

export const module = new Elysia({ prefix: '/module' })
  .post('/', async ({ body,set }) => {
    const result = await registerModule(body)
    if (!result.valid) {
      console.error("/module registering failed")
      throw error(401, "This token has already expired or is not correct")
    }

    set.status = 201
    return {moduleToken: result.body}
  }, {
    body: registerModuleSchema,
    response: t.Object({
      moduleToken: t.String({format: 'uuid'}),
    }),
    detail: {
      description: 'Registers a new module, returning the module unique identifier (this endpoint is expecting to be called by a module)',
      tags: ['module'],
    },
  })
  .use(jwtMiddleware)
  .get('/', async ({jwtPayload }) => {
    const { uuid: user_uuid } = jwtPayload
    const result = await getModules(user_uuid)
    if (!result.valid) {
      throw error(404, result.msg)
    }
    return result.body
  }, {
    response: t.Array(moduleSchema),
    detail: {
      description: 'Get all modules owned by user',
      tags: ['module'],
    },
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
          throw error(404, result.msg)
        return result.body
      }, {
        response: moduleSchema,
        detail: {
          description: 'Get a module by its uuid',
          tags: ['module'],
        },
      })
      .put('/:id', async ({ params, body }) => {
        const result = await updateModule(params.id, body)
        if (!result.valid) {
          throw error(404, result.msg)
        }
        return result.body
      }, {
        response: moduleSchema,
        detail: {
          description: 'Updates a module properties',
          tags: ['module'],
        },
        body: updateModuleSchema
        })
  )