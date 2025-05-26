import Elysia, { error, t, } from "elysia"
import { register, userRegistrySchema, loginUserSchema, generateAccessTokenForCredentials } from "../data/user"
import { configuration } from "../configuration"
import { jwtMiddleware } from "./middleware/jwtMiddleware"
import { setAuthorizationCookie } from "../helpers/http"
import { sarpJWT } from "../jwt"

export const authentication = new Elysia({ prefix: '/authentication' })
  .use(sarpJWT)
  .post(
    '/register',
    async ({ body, jwt, set, cookie }) => {
      const { password, passwordConfirmation } = body
      if (password != passwordConfirmation) {
        throw error(422)
      }
      const result = await register(body)
      if (!result.ok) {
        console.error('/register failed ', result.error)
        // It can only fail bc of conflict
        throw error(409)
      }

      const registeredUser = { username: result.data.username, pwd: password}

      const {accessToken} = await generateAccessTokenForCredentials({
        ...registeredUser,
        sign: jwt.sign
      })

      setAuthorizationCookie(cookie, accessToken)
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
    async ({ body, jwt, cookie }) => {

      const {accessToken} = await generateAccessTokenForCredentials({
        ...body,
        sign: jwt.sign
      })

      setAuthorizationCookie(cookie, accessToken)
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


