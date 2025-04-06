import jwt from "@elysiajs/jwt"
import Elysia, { Cookie, t } from "elysia"
import { configuration } from "../../configuration"

export const JWTSchema = t.Object({
  uuid: t.String({
    format: 'uuid'
  }),
  username: t.String(),
  userRole: t.Integer(),
})

type HeaderCookieSchema = {
  headers: Record<string, string | undefined>,
  cookie: Record<string, Cookie<string | undefined>>
}

/**
 * This middleware checks that we have a JWT token in place in the Authorization header.
 */
export const jwtMiddleware = new Elysia()
  .use(jwt({
    name: 'jwt',
    secret: configuration.jwt_secret!,
    schema: JWTSchema
  }))
  .resolve({ as: 'scoped' }, async ({ cookie, headers, error, jwt }) => {
    const authorization = getAuthenticationToken({ headers, cookie })

    if (!authorization) {
      console.error('Missing token')
      return error(401)
    }

    const payloadOrFalse = await jwt.verify(authorization)
    if (!payloadOrFalse) {
      console.error('Invalid signature')
      return error(401)
    }

    return { jwtPayload: payloadOrFalse }
  })

function getAuthenticationToken({ headers, cookie }: HeaderCookieSchema): string | undefined {
  return [
    cookie.authorization?.value,
    headers['authorization']?.split(' ')?.at(1),
  ].find((token): token is string => token != null)
}