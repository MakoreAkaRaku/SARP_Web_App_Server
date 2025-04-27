import Elysia, { t, error } from "elysia"
import { userSchema, getUser, getUsers, deleteUser, updateUser, updateUserSchema, hasAdminRole, updateUserRole } from "../data/user"
import { jwtMiddleware } from "./middleware/jwtMiddleware"

export const user = new Elysia({ prefix: '/user' })
  .use(jwtMiddleware)
  .get('/', async ({ jwtPayload }) => {
    if (!hasAdminRole(jwtPayload)) {
      throw error(401, "Unauthorized")
    }
    const result = await getUsers()
    if(!result.valid) {
      throw error(404, result.body)
    }
    return result.body
  },{
    response: t.Array(userSchema),
    detail: {
      description: 'Get all users; only users with admin role can do this',
      tags: ['user'],
    },
})
  .get('/profile', async ({ jwtPayload }) => {
    const { uuid } = jwtPayload
    const result = await getUser(uuid)

    if (!result.valid) {
      throw error(401, "Permission denied")
    }
    return result.body
  }, {
    response: userSchema,
    detail: {
      description: 'Gets the logged user profile',
      tags: ['user'],
    }
  })
  .delete('/delete', async ({ jwtPayload, cookie }) => {
    const { uuid } = jwtPayload
    const result = await deleteUser(uuid)
    if (!result.valid) {
      throw error(409, "Conflict")
    }
    cookie['authorization']?.remove()
    return new Response(null, { status: 204 })
  }, {
    response: t.Object({}),
    detail: {
      description: 'Delete the users profile that is logged in',
      tags: ['user'],
    }
  })
  .put('/update', async ({ jwt, jwtPayload, body, cookie }) => {
    const { uuid } = jwtPayload
    const { username, pwd: password, email } = body
    const newCredentials = { uuid, username, password, email }
    const result = await updateUser(newCredentials)
    if (!result.valid) {
      throw error(409, "Conflict with the new credentials")
    }
    const payload = {
      uuid: result.body.uuid,
      username: result.body.username,
      userRole: result.body.permit_id,
    }
    const accessToken = await jwt.sign(payload)

    cookie['authorization']?.update({
      value: accessToken,
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    })

    return new Response(null, { status: 200 })
  }, {
    detail: {
      description: 'Updates the user profile by modifying the credentials',
      tags: ['user'],
    },
    body: updateUserSchema,
    response: t.Object({}),
  })
  .put('/permission', async ({ jwtPayload, body, cookie, jwt }) => {
    if (hasAdminRole(jwtPayload)) {
      const result = await updateUserRole(jwtPayload, body)
      if (!result.valid) {
        throw error(409, result.body)
      }

      const payload = {
        uuid: result.body.uuid,
        username: result.body.username,
        userRole: result.body.permit_id,
      }
      const accessToken = await jwt.sign(payload)

      cookie['authorization']?.update({
        value: accessToken,
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
      })

      return new Response(null, { status: 200 })
    }
    throw error(401, "Unauthorized")
  }, {
    detail: {
      description: 'Update user permission; only users with admin permission can do this',
      tags: ['user'],
    },
    response: t.Object({}),
    body: t.Object({
      uuid: t.String({ format: 'uuid' }),
      userRole: t.Integer()
    })
  })