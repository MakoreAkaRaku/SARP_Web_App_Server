import { tailwind } from "@gtramontina.com/elysia-tailwind";
import Elysia from "elysia";
import { configuration } from "../configuration";


export const tailwindPlugin = (
  configuration.NODE_ENV === 'development'
    ? tailwind({
      path: "/public/stylesheet.css",
      source: "./src/pages/source/styles.css",
      config: "./tailwind.config.js",
      options: {
        minify: false,
        map: true,
        autoprefixer: false
      },
    })
    : new Elysia()
)