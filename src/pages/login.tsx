import { Html } from "@elysiajs/html";
import BaseLayout, { type BaseLayoutProps } from "../components/baselayout";
import Form from "../components/form";
import Input from "../components/input";
import Button from "../components/button";
import ErrorAlert from "../components/erroralert";

type LoginProps ={
  errorMessage?: string
  username?: string,
}


export default function Login({ username, errorMessage, ...rest }: LoginProps) {
  return (
    <BaseLayout title="Iniciar Sesión" {...rest}>
      <div class="flex flex-col items-center gap-y-2 justify-center h-screen">
        <Form
          url="/login"
          headerText="Iniciar Sesión"
          classes="rounded-md shadow-xl bg-gray-800 p-6 sm:p-8 lg:p-10"
          method="POST"
          formActions={
            <Button type="submit" color="dark" class="ml-auto">
              Iniciar sesión
            </Button>}>
          <h1 class="text-2xxl font-bold mb-4 text-center text-white">Iniciar Sesión</h1>
          <br />
          <Input type="text" name="username" label="Usuario" value={username} required placeholder="Introduce tu usuario" />
          <Input type="password" name="pwd" label="Contraseña" required placeholder="Introduce tu contraseña" />
          <ErrorAlert errorMessage={errorMessage} />
        </Form>
        <div class= "flex flex-row gap-x-4 justify-between mb-5">
            <p>No tienes cuenta? </p>
            <a href="/register" class="text-blue-600 hover:underline dark:text-blue-500">Regístrate</a>
          </div>
            <a href="/forgot-password" class="text-blue-600 hover:underline dark:text-blue-500">¿Olvidaste la contraseña?</a>
      </div>
    </BaseLayout>
  )
}