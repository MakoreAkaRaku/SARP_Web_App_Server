import { Elysia, getSchemaValidator, t, type Static } from 'elysia'
import { Html, html } from '@elysiajs/html'
import Home from './home'
import Login from './login'
import Profile from './profile'
import Register from './register'
import { tailwind } from '@gtramontina.com/elysia-tailwind'

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
  .get('/login', () => <Login />)
  .get('/register', () => <Register />)
  .post('/login', ({ body }) => {

    console.log('Somebody is trying to login', body)

    if(body.username === 'marcroman' && body.password === '1234') {
      console.log('Login success')
      return new Response(null, {
        status: 302,
        headers: {
          location: '/profile'
        }
      })
    }

    return <Login errorMessage={"Credenciales inválidas"} username={body.username} />
  }, {
    body: t.Object({
      username: t.String(),
      password: t.String()
    })
  })
  .post('/register', ({ body }) => {

    console.log('Somebody is trying to register', body)

    const req = new Request('/api/register', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)})
    
    console.log('Request', req)
    if(body.username === 'marcroman' && body.password === '1234') {
      console.log('Login success')
      return new Response(null, {
        status: 302,
        headers: {
          location: '/profile'
        }
      })
    }

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

