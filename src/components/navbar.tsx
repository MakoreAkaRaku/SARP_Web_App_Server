import { Html } from "@elysiajs/html"
import { SarpLeafIcon } from "../pages/resources/resources"

export interface BaseNavBarProps {
  classes?: string,
  children?: any
}

export default function HorizontalNavBar({ classes, children }: BaseNavBarProps) {
  return (
    <nav class="bg-gray-800 w-full text-white flex justify-between md:h-16 items-stretch">
      <a href="/" class="flex px-4 flex-row items-center justify-center">
        <SarpLeafIcon classes="size-8" />
        <span class="text-white font-bold text-center text-xl">SARP</span>
      </a>
      <div class="flex flex-row justify-stretch items-center pr-4">
        {children}
      </div>
    </nav>
  )
}