import { test, expect } from 'bun:test'
import { configuration } from "../../../src/configuration"
import Elysia, { getSchemaValidator } from "elysia"
import { JWTSchema } from '../../../src/api/middleware/jwtMiddleware'
import {moduleBodySchema, moduleMiddleware } from '../../../src/api/middleware/moduleMiddleware'
import { generateSignedToken } from '../../helpers/jwt'

  
/**
 * Here we expect / and /123 to be protected by middleware
 */
const protectedController = new Elysia()
  .use(moduleMiddleware)
  .post('/', () => {
    return new Response(null, {
      status: 200
    })
  })
  .post('/123', () => {
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
  uuid: crypto.randomUUID(),
  username: "username" + crypto.randomUUID(),
  userRole: 1
}

const validBodyModule = {
  moduleUUID: crypto.randomUUID()
}

const nonValidBodyModule = {
  moduleUUID: "kikiki"
}

test("this schema should be valid", () => {
  const validator = getSchemaValidator(JWTSchema)
  expect(validator.Check(validPayload)).toBeTrue()
})

test("this schema should be also valid", () => {
  const validator = getSchemaValidator(moduleBodySchema)
  expect(validator.Check(validBodyModule)).toBeTrue()
})

test("it should fail with 422", async () => {
  const req = new Request('http://localhost:3000/', 
    {
      method: "POST",
      body: JSON.stringify({})
    }
  )
  const res = await example.handle(req)
  expect(res.status).toBe(422)
})

test("it should be OK if we do pass a valid object at body", async () => {
  const jwt = await generateSignedToken(validPayload, configuration.jwt_secret!)
  const req = new Request('http://localhost:3000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: JSON.stringify(validBodyModule)
  })
  const res = await example.handle(req)
  expect(res.status).toBe(200)
})

test("it should not be OK if we do pass an invalid object at body", async () => {
  const jwt = await generateSignedToken(validPayload, configuration.jwt_secret!)
  const req = new Request('http://localhost:3000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nonValidBodyModule)
  })
  const res = await example.handle(req)
  expect(res.status).toBe(422)
})

test("it should not be OK if we pass a valid object at body but no token", async () => {
  const req = new Request('http://localhost:3000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validBodyModule)
  })
  const res = await example.handle(req)
  expect(res.status).toBe(401)
})


test("it should be OK to touch an endpoint that is not covered by the middleware", async () => {
  const req = new Request('http://localhost:3000/this-should-also-be-ok')
  const res = await example.handle(req)
  expect(res.status).toBe(200)
})

//TODO: redo tests but only acknowledging the functionality of the guard.