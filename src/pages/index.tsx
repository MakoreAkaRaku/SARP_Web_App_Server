import { Html, html } from '@elysiajs/html'
import { Elysia, error, t } from 'elysia'
import { UserProfile } from '../components/userprofile'
import { getGroups } from '../data/group'
import { getModule, getModules, updateModule, updateModuleSchema, userHasOwnershipOfModule } from '../data/module'
import { getModulePeripherals, getPeripheralData, updatePeripheral, updatePeripheralSpecs } from '../data/peripheral'
import { generateAccessTokenForCredentials, getUser, register } from '../data/user'
import { setAuthorizationCookie } from '../helpers/http'
import AboutUs from './aboutus'
import Dashboard from './dashboard'
import Home from './home'
import Login from './login'
import { softJwtMiddleware } from './middleware/softJwtMiddleware'
import Module from './module'
import Modules from './modules'
import Profile from './profile'
import Register from './register'
import { IconDefaultUser } from './resources/resources'
import { tailwindPlugin } from './tailwind'


export const pages = new Elysia({
  detail: {
    hide: true,
  }
})
  .use(html())
  .use(tailwindPlugin)
  .use(softJwtMiddleware)
  .get('/', ({ currentUser }) => {
    return (<Home userCredentials={currentUser} />)
  })
  .get('/about', ({ currentUser }) => {
    return (<AboutUs userCredentials={currentUser} />)
  })
  .get('/profile', async ({ currentUser, error }) => {
    if (!currentUser) {
      return Response.redirect('/', 302)
    }
    const userProfile = await getUser(currentUser.uuid)
    if (!userProfile.valid) {
      return error(401)
    }
    const user = userProfile.body
    console.log(user)
    return <Profile user={user} userCredentials={currentUser} />
  })
  .get('/login', ({ currentUser }) => {
    if (currentUser) {
      return Response.redirect('/', 302)
    }
    return <Login />
  })
  .get('/logout', ({ cookie }) => {
    if (!cookie['authorization']) {
      return Response.redirect("/", 302)
    }
    cookie['authorization'].remove()
    return Response.redirect("/", 302)
  })
  .get('/register', ({ cookie }) => {
    if (cookie["authorization"]?.value) {
      return Response.redirect('/', 302)
    }
    return <Register />
  })
  .get('/modules', async ({ currentUser }) => {
    if (!currentUser) {
      return Response.redirect('/login', 302)
    }
    const userModules = await getModules(currentUser)
    if (!userModules.valid) {
      return error(401, userModules.msg)
    }

    var navbarElements: JSX.Element[] = []
    navbarElements.push(<UserProfile {...currentUser} />)
    return (<Modules modules={userModules.body} userCredentials={currentUser}>
      <div class="flex flex-col justify-center items-left gap-y-2 p-12 text-justify  md:w-auto">
        <h1 class="text-left text-bold">Módulos</h1>
      </div>
    </Modules>)
  })
  .get('/modules/:uuid', async ({ params, currentUser }) => {
    if (!currentUser) {
      return Response.redirect('/login', 302)
    }
    if (await userHasOwnershipOfModule(currentUser, params) === false) {
      return error(401, "No tienes permisos para acceder a este módulo")
    }
    const userModule = await getModule(params, currentUser)

    if (!userModule.valid) {
      return error(401, userModule.msg)
    }

    const userGroups = await getGroups(currentUser)

    if (!userGroups.valid) {
      return error(401, userGroups.msg)
    }

    const modulePeripherals = await getModulePeripherals(currentUser, userModule.body)

    if (!modulePeripherals.valid) {
      return error(401, modulePeripherals.msg)
    }
    console.log('Module: ', userModule.body)
    console.log('Module peripherals: ', modulePeripherals.body)

    var navbarElements: JSX.Element[] = []
    navbarElements.push(<UserProfile {...currentUser} />)
    return (
      <Module
        userCredentials={currentUser}
        peripheralList={modulePeripherals.body}
        groupList={userGroups.body}
        module={userModule.body}
      />
    )
  })
  .get('/token', async ({ params, currentUser }) => {
    if (!currentUser) {
      return Response.redirect('/login', 302)
    }
    var navbarElements: JSX.Element[] = []
    navbarElements.push(<UserProfile {...currentUser} />)
    //TODO: Implement token page
  })
  .get('/scheduler/:id', async ({ params, currentUser }) => {
    if (!currentUser) {
      return Response.redirect('/login', 302)
    }


    //return <Scheduler />
  })
  .get('/dashboard/:id/', async ({ params, query, currentUser }) => {
    if (!currentUser) {
      return Response.redirect('/login', 302)
    }

    const data = await getPeripheralData(params.id, query)
    if (!data.valid) {
      return error(400)
    }

    return (<Dashboard
      userCredentials={currentUser}
      data={data.body.data}
      range={query}
      peripheral={data.body.peripheral}
    />)
  }, {
    params: t.Object({
      id: t.Numeric()
    }),
    query: t.Optional(
      t.Object({
        begin: t.Date({ format: 'date-time' }),
        end: t.Date({ format: 'date-time' })
      }))
  })
  .post('/modules/:uuid', async ({ params, body, currentUser, error }) => {
    if (!currentUser) {
      return Response.redirect('/login', 302)
    }
    if (await userHasOwnershipOfModule(currentUser, params) === false) {
      return error(401, "No tienes permisos para acceder a este módulo")
    }

    const newModuleFields = { ...body, belong_group: body.belong_group == -1 ? null : body.belong_group }
    const userModule = await updateModule(params, newModuleFields)

    if (!userModule.valid) {
      return error(401, userModule.msg)
    }

    return Response.redirect("/modules/" + params.uuid, 302)
  }, {
    body: updateModuleSchema,
    params: t.Object({
      uuid: t.String({ format: 'uuid' })
    }),
  })
  .post('/peripheral/:module_uuid', async ({ params, body, currentUser }) => {
    if (!currentUser) {
      return Response.redirect('/login', 302)
    }
    if (await userHasOwnershipOfModule(currentUser, { uuid: params.module_uuid }) === false) {
      return error(401, "No tienes permisos para acceder a este módulo")
    }
    const result = await updatePeripheralSpecs(body)

    if (!result.valid) {
      return error(400, "No se ha podido actualizar el periférico")
    }
    return Response.redirect("/modules/" + params.module_uuid, 302)
  }, {
    body: updatePeripheral,
    params: t.Object({
      module_uuid: t.String({ format: "uuid" })
    })
  })
  .post('/login', async ({ cookie, body, jwt }) => {
    console.log('Somebody is trying to login', body)
    try {
      const { accessToken } = await generateAccessTokenForCredentials({
        ...body,
        sign: jwt.sign
      })
      setAuthorizationCookie(cookie, accessToken)
      return Response.redirect('/', 302)
    } catch (error) {
      console.error('Login failed', error)
      return <Login errorMessage={"Credenciales inválidas"} username={body.username} />
    }
  }, {
    body: t.Object({
      username: t.String(),
      pwd: t.String()
    })
  })
  .post('/register', async ({ cookie, body, jwt }) => {
    var errorMessage
    try {
      const { password, confirmPassword } = body
      if (password != confirmPassword) {
        errorMessage = "La contraseña de confirmación no es la misma"
        throw error(409)
      }
      const result = await register(body)
      if (!result.ok) {
        errorMessage = result.reason
        throw error(409)
      }
      const loginUser = { username: result.data.username, pwd: password }
      const { accessToken } = await generateAccessTokenForCredentials({
        ...loginUser,
        sign: jwt.sign
      })
      setAuthorizationCookie(cookie, accessToken)
      return Response.redirect('/', 302)
    } catch (error) {
      console.error('Register failed: ', errorMessage)
      return <Register errorMessage={errorMessage} username={body.username} />
    }
  }, {
    body: t.Object({
      username: t.String({ minLength: 4, maxLength: 20 }),
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 6 }),
      confirmPassword: t.String({ minLength: 6 })
    })
  })

