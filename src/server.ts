import { Elysia, t } from 'elysia'
import { api } from './api'
import swagger from '@elysiajs/swagger'
import { pages } from './pages'
import { staticPlugin } from '@elysiajs/static'
import { configuration } from './configuration'

export const mainApp = new Elysia()
  .use(staticPlugin({
    assets: configuration.PUBLIC_DIR,
  }))
  .use(pages)
	.use(swagger())
	.use(api)
