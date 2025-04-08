import Elysia, {t} from "elysia"
import { moduleMiddleware } from "../../middleware/moduleMiddleware"

export const peripheral = new Elysia({prefix: '/peripheral'})
// .use(peripheralMiddleware)
// .post('/register', async ({body}) => {
//   const {moduleUUID} = body

// })