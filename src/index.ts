import { Elysia, t } from 'elysia'
import { api } from './api'
import swagger from '@elysiajs/swagger'
import { pages } from './pages'
import { staticPlugin } from '@elysiajs/static'

const mainApp = new Elysia()
  .use(staticPlugin({
    prefix: '/',
    assets: './public',
  }))
  .use(pages)
	.use(swagger())
	.use(api)
	.listen(3000)

console.log(
	`Elysia is running at ${mainApp.server?.hostname}:${mainApp.server?.port}`
)