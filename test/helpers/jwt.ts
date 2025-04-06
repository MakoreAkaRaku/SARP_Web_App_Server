import * as jose from 'jose'

export async function generateSignedToken(payload: jose.JWTPayload, jwtSecret: string) {
  const secret = new TextEncoder().encode(
    jwtSecret
  )

  const alg = 'HS256'

  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuer('urn:example:issuer')
    .setAudience('urn:example:audience')
    .setExpirationTime('2h')
    .sign(secret)
}