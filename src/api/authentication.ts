import Elysia, { error, t, } from "elysia"
import { login, register, userRegistrySchema, loginUserSchema } from "../data/user"
import { configuration } from "../configuration"
import { jwtMiddleware, JWTSchema } from "./middleware/jwtMiddleware"
import jwt from "@elysiajs/jwt"

// TODO: Share with jwtMiddleware too
export const myJwt = jwt({
  name: 'jwt_login',
  secret: configuration.jwt_secret!,
  schema: JWTSchema,
  options: {
    expiresIn: '30d',
  },
})


export const authentication = new Elysia({ prefix: '/authentication' })
  .use(myJwt)
  .post(
    '/register',
    async ({ body, jwt_login, set, cookie }) => {
      const { password, passwordConfirmation } = body
      if (password != passwordConfirmation) {
        throw error(422)
      }
      const result = await register(body)
      if (!result.ok) {
        console.error('/register failed', result.errorCode)
        // It can only fail bc of conflict
        throw error(409)
      }

      const { data: registeredUser } = result

      const payload = {
        uuid: registeredUser.uuid,
        username: registeredUser.username,
        userRole: registeredUser.permit_id,
      }
      const accessToken = await jwt_login.sign(payload)

      cookie['authorization']?.set({
        value: accessToken,
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      })

      set.headers['authorization'] = accessToken
      set.status = 201

      return { accessToken }
    }, {
    body: userRegistrySchema,
    response: t.Object({
      accessToken: t.String(),
    }),
    detail: {
      description: 'Register a new user',
      tags: ['authentication'],
    },
  })
  .post(
    '/login',
    async ({ body, jwt_login, set, cookie }) => {
      const { username, pwd } = body
      const result = await login({ username, pwd })
      if (!result.ok) {
        console.error('/login failed', result.errorCode)
        throw error(401)
      }

      const { data: user } = result

      const payload = {
        uuid: user.uuid,
        username: user.username,
        userRole: user.permit_id,
      }
      const accessToken = await jwt_login.sign(payload)

      cookie['authorization']?.set({
        value: accessToken,
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        secure: true,
      })

      return { accessToken }
    }, {
    body: loginUserSchema,
    response: t.Object({
      accessToken: t.String(),
    }),
    detail: {
      description: 'Logs in with the user credentials',
      tags: ['authentication'],
    },
  },
  )
  .use(jwtMiddleware)
  .post('/logout', ({ cookie, set }) => {
    cookie['authorization']?.remove()

    set.headers['authorization'] = undefined

    set.status = 204
    return null
  }, {
    response: t.Object({}),
    detail: {
      description: 'Logs out the user',
      tags: ['authentication'],
    },
  })


