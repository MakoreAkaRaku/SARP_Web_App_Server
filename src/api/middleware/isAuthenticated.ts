import { configuration } from '../../configuration'
import jwt, { type JWTPayloadSpec } from '@elysiajs/jwt'
import cookie from '@elysiajs/cookie'
import Elysia, { error, t, type Context } from 'elysia'
interface IsAuthenticatedParams {
  token: string | undefined,
  jwt: {
    readonly sign: (morePayload: {
     uuid: string, username: string, userRole: number,
    } & JWTPayloadSpec) => Promise<string>;
    readonly verify: (jwt?: string) => Promise<false | ({
      uuid: string, username: string, userRole: number,
    } & JWTPayloadSpec)>;
  }
}

export const authmiddleware = new Elysia()
  .use(app => app
    .use(jwt(
      {
        name: 'jwt',
        secret: configuration.jwt_secret!,
        schema: t.Object(
          {
            uuid: t.String(),
            username: t.String(),
            userRole: t.Integer(),
          }
        )
      }
    ))
    .use(cookie())
    .onBeforeHandle({ as: 'local' }, async ({ jwt, request, cookie }) => {
      const result = await isAuthenticated(
        {
          jwt: jwt,
          token: getTokenAuthentication({ request, cookie })
        }
      )
      if (result.ok === false) {
        return error(401)
      }
    })
  )

export function getTokenAuthentication({ request, cookie }: Pick<Context, 'request' | 'cookie'>) {
  return [
    cookie.auth?.value,
    request.headers.get('auth')?.split(' ')?.at(1),
  ].find(token => token != null)

}

export async function isAuthenticated({ token, jwt }: IsAuthenticatedParams) {
  if (!token) {
    return { ok: false, message: 'No token provided' } as const
  }

  const invalidOrPayload = await jwt.verify(token)
  if (!invalidOrPayload) {
    return { ok: false, message: 'Invalid token' } as const
  }

  return { ok: true, payload: invalidOrPayload } as const
}