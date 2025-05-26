import {Html} from "@elysiajs/html"
import HorizontalNavBar from "./navbar"
import {Cookie} from "elysia"
import { NavElement } from "./navelement"
import type { jwtPayload } from "../jwt"
export interface BaseLayoutProps {
  title?: string,
  children?: any,
  navChildren?: JSX.Element[]
}

function Avatar({ currentUser }: { currentUser: jwtPayload }) {
  return <span>
    {currentUser.username}
  </span>
}

export default function BaseLayout({title, children, navChildren}: BaseLayoutProps) {
  const pageTitle = ['SARP', title].filter(Boolean).join(' - ')
  return(
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        {/* FIX ME PLEASE */}
        <link rel="icon" href="/src/pages/resources/SARP_leaf.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{pageTitle}</title>
        <link rel="stylesheet" href="public/stylesheet.css" />
        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>
      </head>
      <body class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <HorizontalNavBar>
        {navChildren && navChildren.map((child) => (
          <>{child}</>
        ))}
        </HorizontalNavBar>
        {children}        
      </body>
    </html>)}