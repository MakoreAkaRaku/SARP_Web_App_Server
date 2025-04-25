import Elysia from "elysia"
import {module} from './modules'
import { peripheral } from "./peripheral"
import { authentication } from "./authentication"
import { user } from "./user"


export const api = new Elysia({prefix: '/api'})
.use(module)
.use(peripheral)
.use(authentication)
.use(user)