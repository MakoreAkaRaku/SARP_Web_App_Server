import Elysia, {t, error} from "elysia"
import { getUser, deleteUser, updateUser, updateUserSchema, hasAdminRole, updateUserRole } from "../../data/user"
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
.put('/permission', async ({jwtPayload, body}) => {
  if(hasAdminRole(jwtPayload)) {
    const result = await updateUserRole(jwtPayload,body)
    if(!result.valid) {
      return error(409,result.body)
    }

    //TODO: update jwt sign?
    

    return new Response(null, { status:204 })
  }
  return error(401,"Unauthorized")
},{
  body: t.Object({
    uuid: t.String({format: 'uuid'}),
    userRole: t.Integer()
  })
})