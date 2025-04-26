// drizzle.config.ts
import {configuration} from './src/configuration'
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/database/schema.ts",
  dbCredentials: {
    url: configuration.database.url,
  },
});
