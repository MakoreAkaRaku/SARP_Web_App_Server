import { Html, html } from '@elysiajs/html'
import { Elysia, error, t } from 'elysia'
import { UserProfile } from '../components/userprofile'
import { getGroups, registerGroup, updateGroupName } from '../data/group'
import { getModule, getModules, updateModule, updateModuleSchema, userHasOwnershipOfModule } from '../data/module'
import { getModulePeripherals, getPeripheral, getPeripheralData, getPeripheralDataType, updatePeripheral, updatePeripheralSpecs } from '../data/peripheral'
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
import { tailwindPlugin } from './tailwind'
import Tokens from './token'
import { getApiTokens, registerApiToken } from '../data/apitoken'
import Groups from './groups'
import { createSchedule, deleteSchedule, getSchedules, getSchedulesFromUserPeripheralModule as getSchedulesFromUserPeripheral, scheduleInsertSchema, scheduleUpdateSchema, updateSchedule } from '../data/schedule'
import Scheduler from './scheduler'


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

    return (
      <Module
        userCredentials={currentUser}
        peripheralList={modulePeripherals.body}
        groupList={userGroups.body}
        module={userModule.body}
      />
    )
  })
  .get('/token', async ({ currentUser }) => {
    if (!currentUser) {
      return Response.redirect('/login', 302)
    }

    const response = await getApiTokens({ user_uuid: currentUser.uuid })
    if (!response.valid) {
      return error(400)
    }
    return <Tokens userCredentials={currentUser} tokens={response.body} />
  })
  .get("/groups", async ({ currentUser }) => {
    if (!currentUser) {
      return Response.redirect('/login', 302)
    }
    const result = await getGroups(currentUser)
    if (!result.valid) {
      return error(400)
    }
    console.log(result.body)
    return <Groups groups={result.body} userCredentials={currentUser} />
  })
  .get('/scheduler/:id', async ({ params, currentUser }) => {
    if (!currentUser) {
      return Response.redirect('/login', 302)
    }

    const peripheral = await getPeripheral({ id: params.id })

    if (!peripheral.valid) {
      return error(404)
    }

    if(peripheral.body.p_type != 'valve' && peripheral.body.p_type != 'other'){
      return error(401, "peripheral "+ peripheral.body.p_type +" has no ability to schedule")
    }

    const peripheralSchedules = await getSchedulesFromUserPeripheral(currentUser,{id: peripheral.body.id})
    if (!peripheralSchedules.valid) {
      return error(401, peripheralSchedules.message)
    }
    console.log(peripheralSchedules)
    return <Scheduler userCredentials={currentUser} peripheral={peripheral.body} schedules={peripheralSchedules.body} />
  }, {
    params: t.Object({
      id: t.Numeric()
    })
  })
  .get('/dashboard/:id/', async ({ params, query, currentUser }) => {
    if (!currentUser) {
      return Response.redirect('/login', 302)
    }
    let range: { begin: Date | undefined, end: Date | undefined } = {
      begin: undefined,
      end: undefined
    }

    //If we have an acceptable query, we transform the Dates.
    if (query.end !== undefined && query.begin !== undefined) {
      range.begin = new Date(query.begin)
      range.end = new Date(query.end)
      console.log("Query format: ", query.begin)
      console.log("Final result: ", range.begin)
    }

    const data = await getPeripheralData(params.id, range)
    if (!data.valid) {
      return error(400)
    }

    return (<Dashboard
      userCredentials={currentUser}
      data={data.body.data}
      range={range}
      peripheral={data.body.peripheral}
    />)
  }, {
    params: t.Object({
      id: t.Numeric()
    }),
    query: t.Optional(
      t.Object({
        begin: t.String({}),
        end: t.String({})
      }))
  })
  .post('/scheduler/:id', async ({ params, body, currentUser }) => {
    if (!currentUser) {
      return Response.redirect('/login', 302)
    }
    const peripheral = await getPeripheralDataType(params)
    if (peripheral?.type !== 'valve' && peripheral?.type !== 'other') {
      throw error(401, " Peripheral is not a modal active type, it can't be triggered by a Schedule")
    }
    const newSchedule = { ...body, peripheral_id: params.id }

    const result = await createSchedule(newSchedule)
    if (!result.valid) {
      return error(401, result.body)
    }

    return Response.redirect('/scheduler/' + params.id, 302)
  }, {
    body: t.Object({
      name: t.String(),
      cron_expression: t.String()
    }),
    params: t.Object({
      id: t.Numeric()
    })
  })
  .post('/scheduler/update/:id', async ({ params, body, currentUser }) => {
    if (!currentUser) {
      return Response.redirect('/login', 302)
    }

    const modifiedSchedule = { ...body, id: params.id }

    const result = await updateSchedule(modifiedSchedule)


    if (!result.valid) {
      return error(401, result.body)
    }

    return Response.redirect('/scheduler/' + result.body.peripheral_id, 302)
  }, {
    body: t.Object({
      name: t.String()
    }),
    params: t.Object({
      id: t.Numeric()
    })
  })
  .post('/scheduler/delete/:id', async ({ params, body, currentUser }) => {
    if (!currentUser) {
      return Response.redirect('/login', 302)
    }
    const result = await deleteSchedule(params)
    if (!result.valid) {
      return error(401, result.body)
    }

    return Response.redirect('/scheduler/' + result.body.peripheral_id, 302)
  }, {
    params: t.Object({
      id: t.Numeric()
    })
  })
  .post('/token', async ({ currentUser }) => {
    if (!currentUser) {
      return Response.redirect("/", 302)
    }
    await registerApiToken({ user_uuid: currentUser.uuid })
    return Response.redirect("/token", 302)
  })
  .post("/groups/:id", async ({ params, body, currentUser }) => {
    if (!currentUser) {
      return Response.redirect('/login', 302)
    }
    console.log(body)
    if (params.id !== undefined)
      await updateGroupName({ id: params.id, group_name: body.group_name, owner_group: currentUser.uuid })
    else {
      const response = await registerGroup({ group_name: body.group_name, owner_group: currentUser.uuid })

      if (!response.valid) {
        return error(400)
      }
    }

    return Response.redirect('/groups', 302)

  }, {
    params: t.Optional(
      t.Object({
        id: t.Numeric()
      })
    ),
    body: t.Object({
      group_name: t.String()
    })
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

