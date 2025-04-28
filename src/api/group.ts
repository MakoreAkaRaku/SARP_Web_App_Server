import Elysia, { t, error } from "elysia"
import { jwtMiddleware } from "./middleware/jwtMiddleware"
import { getGroup, getGroups, registerGroup, deleteGroup, updateGroupSchema, } from "../data/group"

export const group = new Elysia({ prefix: '/group' })
  .use(jwtMiddleware)
  .post('/', async ({ jwtPayload, body }) => {
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
  .delete('/:id', async ({ jwtPayload, params: { id } }) => {
    const groupProperties = { id, group_name: jwtPayload.uuid } // Assuming these are the properties of the group
    const result = await deleteGroup(groupProperties)
    if (!result.valid) {
      console.error('/group failed', result.body)
      throw error(409)
    }
    return new Response(null, { status: 204 })
  }, {
    params: updateGroupSchema,
    detail: {
      description: 'Deletes a group',
      tags: ['group'],
    },
  })
  .get('/', async ({ jwtPayload }) => {
    const groupList = await getGroups({ owner_group: jwtPayload.uuid })
    if (!groupList.valid) {
      console.error('/group failed', groupList.body)
      throw error(409)
    }
    return groupList.body
  }, {
    detail: {
      description: 'Get all groups from a user',
      tags: ['group'],
    },
  })
  .get('/:id', async ({ jwtPayload, params: { id } }) => {
    const groupProperties = { id, owner_group: jwtPayload.uuid } // Assuming these are the properties of the group
    const result = await getGroup(groupProperties)
    if (!result.valid) {
      console.error('/group failed', result.body)
      throw error(409)
    }
    return new Response(null, { status: 204 })
  }, {
    params: updateGroupSchema,
    detail: {
      description: 'Get a group by its id',
      tags: ['group'],
    },
  })
  .put('/:id', async ({ jwtPayload, params: { id }, body }) => {
    const groupProperties = { id, group_name: jwtPayload.uuid } // Assuming these are the properties of the group
    const result = await deleteGroup(groupProperties)
    if (!result.valid) {
      console.error('/group failed', result.body)
      throw error(409)
    }
    return new Response(null, { status: 204 })
  }, {
    params: updateGroupSchema,
    body: t.Object({
      group_name: t.String(),
    }),
    detail: {
      description: 'Update a group',
      tags: ['group'],
    },
  })
