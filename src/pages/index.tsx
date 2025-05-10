import { Elysia, getSchemaValidator, t, type Static } from 'elysia'
import { Html, html } from '@elysiajs/html'
import Home from './home'
import Login from './login'
import Profile from './profile'
import Register from './register'
import { tailwind } from '@gtramontina.com/elysia-tailwind'
import { configuration } from '../configuration'

export const pages = new Elysia({detail: {
  hide: true,
}})
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
  .get('/', () => <Home />)
  .get('/login', ({ cookie: { authorization } }) => {
    if (authorization?.value) {
      return Response.redirect('/', 302)
    }
    return <Login />
  })
  .get('/register', ({ cookie: { authorization } }) => {
    if (authorization?.value) {
      return Response.redirect('/', 302)
    }
    return <Register />
  })
  .post('/login', async ({ body }) => {

    console.log('Somebody is trying to login', body)

    const response = await fetch(configuration.backend_url+'/api/authentication/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    
    
    if (!response.ok) {
      console.error('Error:', response.statusText)
      return <Login errorMessage={"Credenciales inválidas"} username={body.username} />
    }

    return Response.redirect('/', 302)
  }, {
    body: t.Object({
      username: t.String(),
      pwd: t.String()
    })
  })
  .post('/register', ({ body }) => {

    console.log('Somebody is trying to register', body)

    const response = fetch(configuration.backend_url+'/api/authentication/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    return <Register errorMessage={"Credenciales inválidas"} username={body.username} email={body.email} />
  }, {
    body: t.Object({
      username: t.String({minLength: 4, maxLength: 20}),
      email: t.String({format: 'email'}),
      password: t.String({format: 'password', minLength: 6}),
      confirmPassword: t.String({format: 'password', minLength: 6})
    })
  })
  .get('/profile', () => <Profile />)

