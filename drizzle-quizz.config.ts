import { defineConfig } from "drizzle-kit";
import 'dotenv/config'

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/db/quizz_schema.ts",
    out: "./drizzle/quizz",
    dbCredentials : {
        url : process.env.QUIZZ_DATABASE_URL!,
    },
})