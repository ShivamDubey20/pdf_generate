import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as quizzSchema from "./quizz_schema"
import * as devSchema from "./dev_schema"


const QUIZZ = 
    process.env.QUIZZ_DATABASE_URL || "postgres://postgres:postgres@localhost:5432/quizz";
const DEV =
    process.env.DEV_DATABASE_URL || "postgres://postgres:postgres@localhost:5432/dev";

const quizzClient = postgres(QUIZZ);
const devClient = postgres(DEV);

export const quizzDb = drizzle(quizzClient, {schema: quizzSchema})
export const devDb = drizzle(devClient , {schema : devSchema});