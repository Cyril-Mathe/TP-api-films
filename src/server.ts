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
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { pool } from "./Infrastructure/DB";
import { MovieRepository } from "./Infrastructure/MovieRepository";
import { ScreeningRepository } from "./Infrastructure/ScreeningRepository";
import { router } from "./router";

const movies = new MovieRepository(pool);
const screenings = new ScreeningRepository(pool);

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  // delegate all work to the router, catch unexpected errors
  router(req, res, { pool, movies, screenings }).catch((err) => {
    console.error("router error", err);
    res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: false, error: "Internal Server Error" }));
  });
});

server.listen(3001, "0.0.0.0", () => {
  console.log("Server running on http://localhost:3001");
});