import Elysia from "elysia"
import {module} from './modules/modules'
import { authentication } from "./authentication"


export const api = new Elysia({prefix: '/api'})
.use(module)
.use(authentication)