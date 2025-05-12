import {Html} from "@elysiajs/html"
import HorizontalNavBar from "./navbar"
import {Cookie} from "elysia"
import { NavElement } from "./navelement"
export interface BaseLayoutProps {
  title?: string,
  children?: any,
  cookie?: Record<string, Cookie<string | undefined>>
}

export default function BaseLayout({cookie, title, children }: BaseLayoutProps) {
  const pageTitle = ['SARP', title].filter(Boolean).join(' - ')
  const userOpts = cookie?.['authorization']?.value ?? <NavElement classes="bg-black-900" href="/login" >Iniciar sesión</NavElement>
  return(
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        {/* FIX ME PLEASE */}
        <link rel="icon" href="/src/pages/resources/SARP_leaf.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{pageTitle}</title>
        <link rel="stylesheet" href="public/stylesheet.css" />
      </head>
      <body class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <HorizontalNavBar>
        {userOpts}
        </HorizontalNavBar>
        {children}        
      </body>
    </html>)}