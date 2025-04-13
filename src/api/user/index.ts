import Elysia, {t, error} from "elysia"
import { getUser, deleteUser, updateUser, updateUserSchema, hasAdminRole, updateUserRole } from "../../data/user"
import { jwtMiddleware } from "../middleware/jwtMiddleware"

export const user = new Elysia({ prefix: '/user' })
  .use(jwtMiddleware)
  .get('/profile', async ({ jwtPayload }) => {
    const { uuid } = jwtPayload
    const result = await getUser(uuid)
    
    if(!result.valid) {
      return error(401,"Permission denied")
    }

    return Response.json(result.body)
  })
  .delete('/delete', async({ jwtPayload, cookie }) => {
    const { uuid } = jwtPayload
    const result = await deleteUser(uuid)
    if(!result.valid) {
      return error(409,"Conflict")
    }

    cookie['authorization']?.remove()

    return new Response(null,{status: 204})
  }
  )
  .put('/update', async ({ jwt, jwtPayload, body, cookie }) => {
    const { uuid } = jwtPayload
    const { username, pwd: password, email } = body
    const result = await updateUser({uuid,username, password, email })
    if(!result.valid){
      return error(409,"Conflict with the new credentials")
    }
    const payload = {
      uuid: result.body.uuid,
      username: result.body.username,
      userRole: result.body.permit_id,
    }
    const accessToken = await jwt.sign(payload)

    cookie['authorization']?.update({
      value: accessToken,
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    })

    return new Response(null,{status: 200})
  },{
  body: updateUserSchema
})
.put('/permission', async ({jwtPayload, body, cookie, jwt}) => {
  if(hasAdminRole(jwtPayload)) {
    const result = await updateUserRole(jwtPayload,body)
    if(!result.valid) {
      return error(409,result.body)
    }

    const payload = {
      uuid: result.body.uuid,
      username: result.body.username,
      userRole: result.body.permit_id,
    }
    const accessToken = await jwt.sign(payload)

    cookie['authorization']?.update({
      value: accessToken,
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    })

    return new Response(null, { status:200 })
  }
  return error(401,"Unauthorized")
},{
  body: t.Object({
    uuid: t.String({format: 'uuid'}),
    userRole: t.Integer()
  })
})