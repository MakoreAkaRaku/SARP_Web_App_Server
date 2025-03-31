import Elysia, { error, t, } from "elysia"
import { login, register } from "../../data/user"
import { authmiddleware } from "../middleware/isAuthenticated"




export const authentication = new Elysia({ prefix: '/auth' })
    .use(authmiddleware)
    .post(
        '/register',
        async ({ body, jwt, set}) => {
            const { password, passwordConfirmation } = body
            if (password != passwordConfirmation) {
                return error(422)
            }
            const result = await register(body)
            if(!result.ok) {
                console.error('/register failed', result.errorCode)
                // It can only fail bc of conflict
                return error(409)
            }

            const { data: registeredUser } = result

            const accessToken = await jwt.sign({
                uuid: registeredUser.uuid,
                username: registeredUser.username,
                userRole: registeredUser.permit_id
            })
            set.headers['set-cookie'] = 'auth='+accessToken
            set.headers['auth'] = accessToken

            return new Response(null, { status: 201 })
        }, {
        body: t.Object({
            username: t.String({minLength: 4}),
            email: t.String({ format: 'email' }),
            password: t.String({ minLength: 6 }),
            passwordConfirmation: t.String({ minLength: 6 })
        })
    })
    .post(
        '/login',
        async ({ body, jwt, set }) => {

            const result = await login(body)
            if(!result.ok){
                console.error('/login failed', result.errorCode)
                return error(401)
            }

            const {data: user} = result

            const accessToken = await jwt.sign({
                uuid: user.uuid,
                username: user.username,
                userRole: user.permit_id
            })
            set.headers['set-cookie'] = 'auth='+accessToken
            set.headers['auth'] = accessToken
        }, {
        body: t.Object({
            username: t.String(),
            password: t.String({ minLength: 6 })
        })
    },
    )