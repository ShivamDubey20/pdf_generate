import { defineConfig } from "drizzle-kit";
import 'dotenv/config'

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/db/dev_schema.ts",
    out: "./drizzle/dev",
    dbCredentials : {
        url : process.env.DEV_DATABASE_URL!,
    },
})