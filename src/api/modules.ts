import Elysia, { t, error } from "elysia";
import { selectModuleSchema, registerModule, updateModuleSchema, userHasOwnershipOfModule, updateModule, getModule, getModules, registerModuleSchema, selectModuleWithGroupNameSchema } from "../data/module"
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
    const result = await getModules(jwtPayload)
    if (!result.valid) {
      throw error(404, result.msg)
    }
    return result.body
  }, {
    response: t.Array(selectModuleWithGroupNameSchema),
    detail: {
      description: 'Get all modules owned by user',
      tags: ['module'],
    },
  })
  .guard(
    {
      params: t.Omit(selectModuleSchema, ['alias', 'last_seen', 'token_api', 'belong_group']),
      beforeHandle: async ({ jwtPayload, params }) => {
        if (!hasAdminRole(jwtPayload)) {
          const module = {uuid: params.uuid}
          const hasOwnership = await userHasOwnershipOfModule(jwtPayload,module)
          if (!hasOwnership) return error(401)
        }
      }
    },
    (app) => app
      .get('/:id', async ({ params, jwtPayload }) => {
        const result = await getModule({uuid: params.id}, jwtPayload)
        if (!result.valid) {
          throw error(404, result.msg)
        }
        return result.body
      }, {
        response: selectModuleSchema,
        detail: {
          description: 'Get a module by its uuid',
          tags: ['module'],
        },
      })
      .put('/:id', async ({ params, body }) => {
        const result = await updateModule({uuid: params.id}, body)
        if (!result.valid) {
          throw error(404, result.msg)
        }
        return result.body
      }, {
        response: t.Object({
          uuid: t.String({format: 'uuid'}),
          alias: t.String(),
          token_api: t.String(),
          last_seen: t.Union([t.Date(), t.Null()]),
          belong_group: t.Union([t.Number(),t.Null()]), 
        }),
        detail: {
          description: 'Updates a module properties',
          tags: ['module'],
        },
        body: updateModuleSchema
        })
  )