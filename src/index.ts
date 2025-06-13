import { configuration } from "./configuration"
import { mainApp } from "./server"

mainApp.listen(configuration.PORT)

console.log(
  `Elysia is running at ${mainApp.server?.hostname}:${mainApp.server?.port}`
)