import jwt, { type JWTPayloadSpec } from "@elysiajs/jwt";
import { t, type Static } from 'elysia'
import { configuration } from "./configuration";

export const JWTSchema = t.Object({
  uuid: t.String({
    format: 'uuid'
  }),
  username: t.String(),
  userRole: t.Integer(),
})

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type jwtPayload = Prettify<Static<typeof JWTSchema> & JWTPayloadSpec>

export const sarpJWT = jwt({
  name: 'jwt',
  secret: configuration.jwt_secret!,
  schema: JWTSchema,
  options: {
    expiresIn: '30d'
  }
})