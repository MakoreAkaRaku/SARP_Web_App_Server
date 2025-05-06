import { Elysia, t } from 'elysia'
import { api } from './api'
import swagger from '@elysiajs/swagger'
import { pages } from './pages'

const mainApp = new Elysia()  
  .use(pages)
	.use(swagger())
	.use(api)
	.listen(3000)

console.log(
	`Elysia is running at ${mainApp.server?.hostname}:${mainApp.server?.port}`
)