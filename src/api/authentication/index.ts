import Elysia, { error, t, } from "elysia"
import { getUser, login, register, userRegistrySchema, loginUserSchema } from "../../data/user"
import { configuration } from "../../configuration"
import { jwtMiddleware, JWTSchema } from "../middleware/jwtMiddleware"
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


export const authentication = new Elysia({ prefix: '/auth' })
  .use(myJwt)
  .post(
    '/register',
    async ({ body, jwt_login, set, cookie }) => {
      const { password, passwordConfirmation } = body
      if (password != passwordConfirmation) {
        return error(422)
      }
      const result = await register(body)
      if (!result.ok) {
        console.error('/register failed', result.errorCode)
        // It can only fail bc of conflict
        return error(409)
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
      })

      set.headers['authorization'] = accessToken

      return new Response(null, { status: 201 })
    }, {
    body: userRegistrySchema
  })
  .post(
    '/login',
    async ({ body, jwt_login, set, cookie }) => {
      const { username, pwd } = body
      const result = await login({username, pwd})
      if (!result.ok) {
        console.error('/login failed', result.errorCode)
        return error(401)
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
        secure: true,
      })
    }, {
    body: loginUserSchema
  },
  )
  .use(jwtMiddleware)
  .post('/logout', ({ cookie, set }) => {
    cookie['authorization']?.remove()

    set.headers['authorization'] = undefined

    return new Response(null, { status: 204 })
  })


