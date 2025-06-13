import { tailwindPlugin } from "./src/pages/tailwind";


const tailwindRequest = () => {
  const headers = new Headers()
  headers.append('Accept', 'text/css')
  const req = new Request('http://localhost:3000/public/stylesheet.css', {
    method: 'GET',
    headers
  })

  return req
}

const response = await tailwindPlugin.handle(tailwindRequest())
const css = await response.text()

await Bun.write('./public/stylesheet.css', css)
console.log('Finished generating /public/stylesheet.css')