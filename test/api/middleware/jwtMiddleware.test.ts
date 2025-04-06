import { test, expect } from 'bun:test'
import { configuration } from "../../../src/configuration"
import Elysia, { getSchemaValidator } from "elysia"
import { JWTSchema, jwtMiddleware } from '../../../src/api/middleware/jwtMiddleware'
import { generateSignedToken } from '../../helpers/jwt'



const other = new Elysia()
  .get('/', () => {
    return new Response(null, {
      status: 200
    })
  })
/**
 * Here we expect / and /123 to be protected by middleware
 */
const protectedController = new Elysia()
  .use(jwtMiddleware)
  .use(other)
  .get('/123', () => {
    return new Response(null, {
      status: 200
    })
  })

/**
 * Here you shouldn't expect it to be protected
 */
const unprotectedController = new Elysia()
  .get('/this-should-also-be-ok', () => {
    return new Response(null, {
      status: 200
    })
  })

/**
 * Example where we are using a protected controller
 * and an unprotected controller
 */
const example = new Elysia()
  .use(protectedController)
  .use(unprotectedController)






const validPayload = {
  uuid: 'this-aint-a-uuid',
  username: "username" + crypto.randomUUID(),
  userRole: 1
}

test("this schema should be valid", () => {
  const validator = getSchemaValidator(JWTSchema)
  expect(validator.Check(validPayload)).toBeTrue()
})

test("it should fail with 401", async () => {
  const req = new Request('http://localhost:3000/')
  const res = await example.handle(req)
  expect(res.status).toBe(401)
})

test("it should be NOT OK if we pass a valid token with invalid claims", async () => {
  const jwt = await generateSignedToken({ 'urn:example:claim': true }, configuration.jwt_secret!)
  const req = new Request('http://localhost:3000/', {
    headers: {
      Authorization: 'Bearer ' + jwt
    }
  })
  const res = await example.handle(req)
  expect(res.status).toBe(401)
})

test("it should be OK if we pass a valid token with valid claims", async () => {
  const jwt = await generateSignedToken(validPayload, configuration.jwt_secret!)
  let req = new Request('http://localhost:3000/', {
    headers: {
      Authorization: 'Bearer ' + jwt
    }
  })
  let res = await example.handle(req)
  expect(res.status).toBe(200)
  req = new Request('http://localhost:3000/', {
    headers: {
      Cookie: 'authorization=' + jwt
    }
  })
  res = await example.handle(req)
  expect(res.status).toBe(200)
})

test("it should be OK to touch an endpoint that is not covered by the middleware", async () => {
  const req = new Request('http://localhost:3000/this-should-also-be-ok')
  const res = await example.handle(req)
  expect(res.status).toBe(200)
})