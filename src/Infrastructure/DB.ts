// Créer ici la connexion PostgreSQL (`pg.Pool`) en lisant `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME`.
import { Pool } from "pg";
import { env } from "./config.ts";

export const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});

console.log({process : process.env})