import {Html} from "@elysiajs/html"

export interface BaseLayoutProps {
  title?: string
  children?: any
}

export default function BaseLayout({ title, children }: BaseLayoutProps) {
  const pageTitle = ['SARP', title].filter(Boolean).join(' - ')
  return(
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{pageTitle}</title>
        <link rel="stylesheet" href="public/stylesheet.css" />
      </head>
      <body class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  )
}