import swagger from "@elysiajs/swagger"
import Elysia from "elysia"
import { configuration } from "./configuration"

const isEnabled = configuration.SWAGGER_ENABLED

export const swaggerPlugin = (
  isEnabled
    ? swagger({})
    : new Elysia()
)
