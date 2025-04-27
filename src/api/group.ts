import Elysia, { t, error } from "elysia"
import { jwtMiddleware } from "./middleware/jwtMiddleware"
import { registerGroup } from "../data/group"

export const group = new Elysia({ prefix: '/group' })
.use(jwtMiddleware)
  .post('/', async ({ jwtPayload,body }) => {
    const newGroup = { owner_group: jwtPayload.uuid, ...body } // Assuming id is auto-generated
    const result = await registerGroup(newGroup)
    if (!result.valid) {
      console.error('/group failed', result.body)
      throw error(409)
    }

    return new Response(null, { status: 201 })
  }, {
    body: t.Object({
      group_name: t.String(),
    }),
    response: t.Object({}),
    detail: {
      description: 'Create a new group',
      tags: ['group'],
    },
  })