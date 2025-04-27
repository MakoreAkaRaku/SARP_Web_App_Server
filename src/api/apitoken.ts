import Elysia, { t, error } from "elysia"
import { deleteApiToken, getApiTokens, updateApiTokenSchema, registerApiToken, userHasOwnershipOfApiToken } from "../data/apitoken"
import { hasAdminRole } from "../data/user"
import { jwtMiddleware } from "./middleware/jwtMiddleware"

export const apiToken = new Elysia({ prefix: '/token' })
  .use(jwtMiddleware)
  .post('/', async ({ jwtPayload, }) => {
    const tokenApiUser = { user_uuid: jwtPayload.uuid }
    const result = await registerApiToken(tokenApiUser)
    if (!result.valid) {
      throw error(401, result.body)
    }
    return result.body
  },
  {
    response: t.String({ format: 'uuid' }),
    detail: {
      description: 'Creates a new API token',
      tags: ['apitoken'],
    },
  })
  .get('/', async ({ jwtPayload, }) => {
    const user = { user_uuid: jwtPayload.uuid }
    const result = await getApiTokens(user)

    if (!result.valid) {
      throw error(401, "Permission denied")
    }

    return result.body
  },
  {
    response: t.Array(t.Object({ token_api: t.String({ format: 'uuid' })})),
    detail: {
      description: 'Get all API tokens from the logged user',
      tags: ['apitoken'],
    },
  })
  .delete('/:token_api', async ({ jwtPayload, params }) => {
    const apiToken = { token_api: params.token_api }
    const result = await deleteApiToken(apiToken)
    if (!result.valid) {
      return error(409, result.msg)
    }

    return new Response(null, { status: 204 })
  },
  {
      params: updateApiTokenSchema,
      response: t.Object({}),
      detail: {
        description: 'Deletes the API token from the logged user passed by params',
        tags: ['apitoken'],
      },
      beforeHandle: async ({ jwtPayload, params }) => {
        const config = { user_uuid: jwtPayload.uuid, token_api: params.token_api }
        if (!hasAdminRole(jwtPayload)) {
          const hasOwnership = await userHasOwnershipOfApiToken(config)
          if (!hasOwnership) return error(401)
        }
      }
    })