import { Html } from "@elysiajs/html";
import BaseLayout, { type BaseLayoutProps } from "../components/baselayout";
import Form from "../components/form";
import Input from "../components/input";
import Button from "../components/button";
import ErrorAlert from "../components/erroralert";

interface RegisterProps extends BaseLayoutProps {
  errorMessage?: string
  username?: string
  email?: string
}


export default function Register({ username, email, errorMessage, userCredentials }: RegisterProps ) {
  return (
    <BaseLayout title="Registrarse" {...{userCredentials}}>
      <div class="flex flex-col items-center justify-center h-screen gap-y-2">
        <Form
          url="/register"
          classes="rounded-md shadow-xl bg-gray-800 p-6 sm:p-8 lg:p-10"
          method="POST"
          formActions={
            <Button type="submit" color="dark" class="ml-auto">
              Crear cuenta
            </Button>}>
          <h1 class="text-2xxl font-bold mb-4 text-center text-white">Crear una cuenta</h1>
          <br />
          <Input type="text" name="username" label="Usuario" value={username} required placeholder="Introduce un nuevo username" />
          <Input type="email" name="email" label="Email" required placeholder="email@example.com" />
          <div class = "flex flex-row gap-x-2 mb-5">
          <Input type="password" name="password" label="Contraseña" required placeholder="Introduce tu contraseña" />
          <Input type="password" name="confirmPassword" label="Repita contraseña" required placeholder="Repite la contraseña" />
          </div>
          <ErrorAlert errorMessage={errorMessage} />
        </Form>
        <div class= "flex flex-row gap-x-2 mb-5">
            <p>Ya tienes cuenta? </p>
            <a href="/login" class="text-blue-600 hover:underline dark:text-blue-500">Inicia Sesión</a>
          </div>
      </div>
    </BaseLayout>
  )
}