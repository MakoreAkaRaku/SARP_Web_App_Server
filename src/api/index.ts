import Elysia from "elysia"
import {module} from './modules'
import { authentication } from "./authentication"
import { user } from "./user"


export const api = new Elysia({prefix: '/api'})
.use(module)
.use(authentication)
.use(user)