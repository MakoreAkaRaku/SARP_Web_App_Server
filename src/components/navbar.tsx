import {Html } from "@elysiajs/html"
import SarpLeafIcon from "../pages/resources/utils"

export interface BaseNavBarProps {
  classes?: string,
  children?: any
}

export default function HorizontalNavBar({classes,children}: BaseNavBarProps) {
  return (
    <nav class="bg-gray-800 py-2 px-4 w-full text-white flex justify-between items-center">      
        <div class="text-white font-bold text-center text-xl">
            <a href="/" class= "flex flex-col justify-center">
            <SarpLeafIcon classes="h-16 w-16" />
            SARP
            </a>
        </div>
        <div class="flex flex-row justify-begin">
          {children}
        </div>
    </nav>
  )
}