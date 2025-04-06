import { test, expect, mock } from 'bun:test'
import { generateSignedToken } from '../../helpers/jwt'
import { configuration } from '../../../src/configuration'
import { user } from '../../../src/api/user'

const getUserMock = mock(async (uuid: string) => ({ 
  uuid
}))

// Mock the getUser function within the data/user.ts file
mock.module('../../data/user', () => ({
  getUser: getUserMock
}))

test('can get user profile', async () => {
  const uuid = crypto.randomUUID()
  const validJWT = await generateSignedToken(
    {
      uuid,
      username: 'username' + crypto.randomUUID(),
      userRole: 1
    },
    configuration.jwt_secret!)
  const req = new Request('http://localhost:3000/user/profile', {
    headers: {
      authorization: 'Bearer '+validJWT
    }
  })

  const response = await user.handle(req)
  expect(response.status).toBe(200)
  expect(getUserMock).toHaveBeenCalledWith(uuid)
  expect(getUserMock).toHaveBeenCalledTimes(1)

})