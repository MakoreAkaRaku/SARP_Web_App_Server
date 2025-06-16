import { Html } from "@elysiajs/html"
import HorizontalNavBar from "./navbar"
import type { jwtPayload } from "../jwt"

export interface BaseLayoutProps {
  title?: string,
  children?: any,
  userCredentials?: jwtPayload
}

export default function BaseLayout({ title, children, userCredentials }: BaseLayoutProps) {
  const pageTitle = ['SARP', title].filter(Boolean).join(' - ')
  return (
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="/public/SARP_leaf.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{pageTitle}</title>
        <link rel="stylesheet" href="/public/stylesheet.css" />
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.min.js"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>
        <script defer src="/public/script.js"/>
      </head>
      <body class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <HorizontalNavBar userCredentials={userCredentials} />
        {children}
      </body>
    </html>
  )
}