import Elysia, {t} from "elysia"
import { getUser, deleteUser, updateUser, updateUserSchema } from "../../data/user"
import { jwtMiddleware } from "../middleware/jwtMiddleware"

export const user = new Elysia({ prefix: '/user' })
  .use(jwtMiddleware)
  .get('/profile', ({ jwtPayload }) => {
    const { uuid } = jwtPayload
    return getUser(uuid)
  })
  .delete('/delete', ({ jwtPayload }) => {
    const { uuid } = jwtPayload
    return deleteUser(uuid)
  }
  )
  .put('/update', ({ jwtPayload, body }) => {
    const { uuid } = jwtPayload
    const { username, pwd: password, email } =body
    return updateUser({uuid,username, password, email })
  },{
  body: updateUserSchema
})