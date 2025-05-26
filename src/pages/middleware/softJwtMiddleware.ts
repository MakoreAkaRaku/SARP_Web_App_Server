import Elysia from "elysia"
import { sarpJWT } from "../../jwt"
import type { HeaderCookieSchema } from "../../api/middleware/jwtMiddleware"

export const softJwtMiddleware = new Elysia()
  .use(sarpJWT)
  .resolve({ as: 'scoped' }, async ({ cookie, headers, jwt }) => {
    const authorization = getAuthenticationToken({ headers, cookie })

    if (!authorization) {
      return { currentUser: undefined }
    }

    const payloadOrFalse = await jwt.verify(authorization)
    if (!payloadOrFalse) {
      return { currentUser: undefined }
    }

    return { currentUser: payloadOrFalse }
  })

function getAuthenticationToken({ headers, cookie }: HeaderCookieSchema): string | undefined {
  return [
    cookie.authorization?.value,
    headers['authorization']?.split(' ')?.at(1),
  ].find((token): token is string => token != null)
}