import BaseLayout, { type BaseLayoutProps } from "../components/baselayout";
import { Html } from "@elysiajs/html";
import { IconDefaultUser } from "./resources/resources";
import type { User } from "../data/user";
import { NavElement } from "../components/navelement";

interface ProfileProps extends BaseLayoutProps {
  user: User
}


export default function Profile(props: ProfileProps) {
  const userProfilePicClasses = "size-52 rounded-full ring-offset-2 ring-2 ring-black"
  const userImg = props.user.profile_pic_id != null ? //If has an identifier, means that has a profile pic
    <img class={userProfilePicClasses} src={"/"/*TODO*/} /> :
    <IconDefaultUser classes={userProfilePicClasses} />

  const userProfilePic = <a class="flex justify-center items-center size-52 hover:bg-gray-900/20 relative rounded-full bg-gray-700 ring-black" href='/TODO'>
    {userImg}
    <div class="flex items-center justify-center text-center absolute w-full h-full opacity-0 hover:opacity-100 duration-300 text-md font-semibold">
      <span>Cambiar imagen</span>
    </div>
  </a>
  return (
    <BaseLayout title="Profile" {...props}>
      <div class="flex flex-col justify-center items-left gap-y-2 p-12 text-justify  md:w-auto">
        <h1 class="text-left text-bold">MI PERFIL</h1>
        <div class="w-full p-4 rounded-lg bg-gray-800/60">
          {userProfilePic}
          <NavElement href="/logout">Cerrar Sesión</NavElement>
        </div>
      </div>
    </BaseLayout>
  )
}