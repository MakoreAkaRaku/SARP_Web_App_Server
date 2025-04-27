import Elysia from "elysia"
import {module} from './modules'
import { peripheral } from "./peripherals"
import { authentication } from "./authentication"
import { user } from "./user"
import { apiToken } from "./apitoken"
import { group } from "./group"


export const api = new Elysia({prefix: '/api'})
.use(module)
.use(peripheral)
.use(authentication)
.use(user)
.use(apiToken)
.use(group)