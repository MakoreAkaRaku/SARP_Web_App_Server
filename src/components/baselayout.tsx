import { Html } from "@elysiajs/html"
import HorizontalNavBar from "./navbar"

export interface BaseLayoutProps {
  title?: string,
  children?: any,
  navChildren?: JSX.Element[]
}

export default function BaseLayout({ title, children, navChildren }: BaseLayoutProps) {
  const pageTitle = ['SARP', title].filter(Boolean).join(' - ')
  return (
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        {/* FIX ME PLEASE */}
        <link rel="icon" href="/SARP_leaf.svg" />
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