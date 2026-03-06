// Point d’entrée HTTP (à implémenter)
//
// Objectif :
// - créer le serveur HTTP
// - déléguer le routage à `router.ts`
//
// Utiliser :
// - `node:http`
// - `router` depuis `router.ts`
// - les repositories depuis `Infrastructure/`
import { pool } from "./Infrastructure/DB";
import { MovieRepository } from "./Infrastructure/MovieRepository";
import { ScreeningRepository } from "./Infrastructure/ScreeningRepository";
import { router } from "./router";
import express from "express"

const app = express()
const movies = new MovieRepository(pool);
const screenings = new ScreeningRepository(pool);

app.use(express.json());
router(app, { pool, movies, screenings });

app.listen(3001, "0.0.0.0", () => {
  console.log("Server running on http://localhost:3001");
});