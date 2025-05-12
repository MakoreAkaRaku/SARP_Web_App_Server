import {Html} from "@elysiajs/html"
type NavButtonProps = {
  classes?: string,
  children?: any,
  autofocus?: string,
  draggable?: boolean,
  hidden?: boolean,
  href: string
}

export function NavElement({href, children, classes} : NavButtonProps) {
  return (
  <a href={href} class={"flex items-center h-full px-4 "+classes}>
    {children}
  </a>
  )}