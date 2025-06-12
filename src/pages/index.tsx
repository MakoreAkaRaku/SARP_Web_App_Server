import { Elysia, t, error } from 'elysia'
import { Html, html } from '@elysiajs/html'
import AboutUs from './aboutus'
import Login from './login'
import Home from './home'
import Profile from './profile'
import Register from './register'
import { tailwind } from '@gtramontina.com/elysia-tailwind'
import { softJwtMiddleware } from './middleware/softJwtMiddleware'
import { generateAccessTokenForCredentials, getUser, register } from '../data/user'
import { setAuthorizationCookie } from '../helpers/http'
import { NavElement } from '../components/navelement'
import { UserProfile } from '../components/userprofile'
import { IconDefaultUser } from './resources/resources'
import Modules from './modules'
import { getModule, getModules, updateModule, updateModuleSchema, userHasOwnershipOfModule } from '../data/module'
import Module from './module'
import { getGroups } from '../data/group'
import { getModulePeripherals, updatePeripheral, updatePeripheralSpecs } from '../data/peripheral'

const navBarLoginComponent = <NavElement classes='' href="/login">Inicia Sesión</NavElement>
const navBarAboutComponent = <NavElement classes='' href="/about">Acerca de SARP</NavElement>
export const pages = new Elysia({
  detail: {
    hide: true,
  }
})
  .use(html())
  .use(tailwind({
    path: "/public/stylesheet.css",
    source: "./src/pages/source/styles.css",
    config: "./tailwind.config.js",
    options: {
      minify: false,
      map: true,
      autoprefixer: false
    },
  }))
  .use(softJwtMiddleware)
  .get('/', ({ currentUser }) => {
    const navbarElements: JSX.Element[] = []
    if (currentUser != undefined) {
      console.log(currentUser)
      navbarElements.push(<UserProfile {...currentUser} />)
    } else {
      navbarElements.push(navBarLoginComponent)
    }
    return (<Home navChildren={navbarElements} />)
  })
  .get('/about', ({ currentUser }) => {
    const navbarElements: JSX.Element[] = []
    if (currentUser != undefined) {
      console.log(currentUser)
      navbarElements.push(<UserProfile {...currentUser} />)
    } else {
      navbarElements.push(navBarLoginComponent)
    }
    return (<AboutUs navChildren={navbarElements} />)
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
    const userProfilePicClasses = "size-52 rounded-full ring-offset-2 ring-2 ring-black"
    const userImg = user.profile_pic_id != null ? //If has an identifier, means that has a profile pic
      <img class={userProfilePicClasses} src={"/"/*TODO*/} /> :
      <IconDefaultUser classes={userProfilePicClasses} />
    const userProfilePic = <a class="flex justify-center items-center size-52 hover:bg-gray-900/20 relative rounded-full bg-gray-700 ring-black" href='/TODO'>
      {userImg}
      <div class="flex items-center justify-center text-center absolute w-full h-full opacity-0 hover:opacity-100 duration-300 text-md font-semibold">
        <span>Cambiar imagen</span>
      </div>
    </a>
    var navbarElements: JSX.Element[] = []
    navbarElements.push(<UserProfile {...currentUser} />)
    return <Profile navChildren={navbarElements}>
      <div class="flex flex-col justify-center items-left gap-y-2 p-12 text-justify  md:w-auto">
        <h1 class="text-left text-bold">MI PERFIL</h1>
        <div class="w-full p-4 rounded-lg bg-gray-800/60">
          {userProfilePic}
        </div>
      </div>
    </Profile>
  })
  .get('/login', ({ currentUser }) => {
    if (currentUser) {
      return Response.redirect('/', 302)
    }
    return <Login />
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
    return (<Modules modules={userModules.body} navChildren={navbarElements}>
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
    return (<Module peripheralList={modulePeripherals.body} groupList={userGroups.body} module={userModule.body} navChildren={navbarElements} />)
  })
  .get('/token/:uuid', async ({ params, currentUser }) => {
    if (!currentUser) {
      return Response.redirect('/login', 302)
    }
    const { uuid } = params
    var navbarElements: JSX.Element[] = []
    navbarElements.push(<UserProfile {...currentUser} />)
    //TODO: Implement token page
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
    if (await userHasOwnershipOfModule(currentUser, {uuid: params.module_uuid}) === false) {
      return error(401, "No tienes permisos para acceder a este módulo")
    }
    const result = await updatePeripheralSpecs(body)

    if(!result.valid) {
      return error(400,"No se ha podido actualizar el periférico") 
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
      return Response.redirect('/', {
        status: 302
      })
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
      return Response.redirect('/', {
        status: 302
      })
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
  .post('/logout', ({ cookie }) => {
    if (!cookie['authorization']) {
      return Response.redirect("/", 302)
    }
    cookie['authorization'].remove()
    return Response.redirect("/", 302)
  })

