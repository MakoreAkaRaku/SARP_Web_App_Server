import {Html} from "@elysiajs/html";
import BaseLayout from "../components/baselayout"

export default function Home() {
  return (
    <BaseLayout title="Home">
      <h1>Hola soc un home</h1>
      <p>Hola soc un home</p>
      <a href="/profile">Go to profile</a>
    </BaseLayout>
  )
}