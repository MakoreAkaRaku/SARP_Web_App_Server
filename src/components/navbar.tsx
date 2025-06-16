import { Html } from "@elysiajs/html"
import { IconDevice, IconGroup, IconLogin, IconToken, SarpLeafIcon } from "../pages/resources/resources"
import type { jwtPayload } from "../jwt"
import { NavElement } from "./navelement"
import { UserProfile } from "./userprofile"

export interface BaseNavBarProps {
  userCredentials: jwtPayload | undefined
}

export default function HorizontalNavBar({ userCredentials }: BaseNavBarProps) {

  const navListElements = getNavElementsList({ userCredentials })

  return (
    <nav class="bg-gray-800 w-full text-white flex justify-between md:h-16 items-stretch">
      <a href="/" class="flex px-4 flex-row items-center justify-center">
        <SarpLeafIcon classes="size-8" />
        <span class="text-white font-bold text-center text-xl">SARP</span>
      </a>
      <div class="flex flex-row justify-stretch items-center gap-x-4 pr-4">
        {navListElements}
      </div>
    </nav>
  )
}

function getNavElementsList({ userCredentials }: BaseNavBarProps) {

  const elementList = []
  if (userCredentials) { //We are logged in
    elementList.push(<NavElement href="/groups"><IconGroup classes="size-10"/></NavElement>)
    elementList.push(<NavElement href="/token"><IconToken classes="size-10"/></NavElement>)
    elementList.push(<NavElement href="/modules"><IconDevice classes="size-10"/></NavElement>)
    elementList.push(<NavElement href="/about">Acerca de SARP</NavElement>)
    elementList.push(<UserProfile {...userCredentials} />)
  }
  else { //We are not logged in

    elementList.push(<NavElement href="/about">Acerca de SARP</NavElement>)
    elementList.push(<NavElement href="/login"><div class="flex flex-row gap-x-2"><IconLogin/> <p>Inicia Sesión</p></div></NavElement>)
  }
  return <>
    {...elementList}
  </>
}