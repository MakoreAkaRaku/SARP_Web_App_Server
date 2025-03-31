import { Elysia, t } from 'elysia'
import { api } from './api/index'
import swagger from '@elysiajs/swagger'

const mainApp = new Elysia()
	.use(swagger())
	.use(api)
	.listen(3000)

console.log(
	`Elysia is running at ${mainApp.server?.hostname}:${mainApp.server?.port}`
)