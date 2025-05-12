import {Html} from "@elysiajs/html"
import BaseLayout from "../components/baselayout"
import type { Cookie } from "elysia"

interface HomeProps {
  cookie?: Record<string, Cookie<string | undefined>>
}

export default function Home({cookie} : HomeProps) {
  
  return (
    <BaseLayout cookie={cookie} title="Home">
      <h1>Hola soc un home</h1>
      <p>Hola soc un home</p>
      <a href="/profile">Go to profile</a>
    </BaseLayout>
  )
}