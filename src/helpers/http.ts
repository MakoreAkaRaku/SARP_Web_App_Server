import { Cookie } from 'elysia'

export function setAuthorizationCookie(
  cookie: Record<string, Cookie<string | undefined>>,
  accessToken: string
) {
  cookie['authorization']?.set({
    value: accessToken,
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    secure: true,
  })
}