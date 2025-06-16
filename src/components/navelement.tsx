import {Html} from "@elysiajs/html"
type NavButtonProps = {
  classes?: string,
  children?: any,
  autofocus?: string,
  draggable?: boolean,
  hidden?: boolean,
  href: string
}

export function NavElement({
  href, 
  children, 
  classes="flex items-center px-4 border-green-700 rounded-md hover:bg-gray-600 hover:border-green-500 shadow-md border-x-2 h-12"
} : NavButtonProps) {
  return (
  <a href={href} class={classes}>
    {children}
  </a>
  )}