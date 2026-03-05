// Router HTTP (à implémenter)
//
// Objectif :
// - gérer les routes :
//   - GET /health
//   - GET /movies
//   - GET /movies/:id/screenings
// - envoyer les réponses JSON directement ici (sendJson / sendError)
//
// Conseil :
// - créer deux helpers locaux :
//   - sendJson(res, status, data)
//   - sendError(res, status, message)
// - parser `path` + `segments` avec :
//   - const [path] = (req.url ?? "/").split("?", 2)
//   - const segments = (path ?? "/").split("/").filter(Boolean)

import type { IncomingMessage, ServerResponse } from "node:http";
import type { Pool } from "pg";
import { MovieRepository } from "./Infrastructure/MovieRepository";
import { ScreeningRepository } from "./Infrastructure/ScreeningRepository";

export type RouterDeps = {
  pool: Pool;
  movies: MovieRepository;
  screenings: ScreeningRepository;
};

export async function router(
  req: IncomingMessage,
  res: ServerResponse,
  deps: RouterDeps
): Promise<void> {
  const method = req.method ?? "GET";
  const rawUrl = req.url ?? "/";
  const path = rawUrl.split("?", 2)[0] ?? "/";
  const segments = path.split("/").filter(Boolean);

  function sendJson(status: number, data: unknown): void {
    res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(data));
  }

  function sendError(status: number, message: string): void {
    sendJson(status, { ok: false, error: message });
  }

  if (method === "GET" && path === "/") {
    return sendJson(200, { ok: true, message: "Movie API" });
  }
  
  if (method === "GET" && path === "/health") {
    return sendJson(200, { ok: true });
  }

  if (method === "GET" && path === "/movies") {
    const items = await deps.movies.list();
    return sendJson(200, { ok: true, items });
  }

  if (
    method === "GET" &&
    segments[0] === "movies" &&
    (segments[2] === "screenings" || segments[2] === "seances")
  ) {
    const movieId = Number(segments[1]);
    if (Number.isNaN(movieId)) {
      return sendError(400, "Invalid movie id");
    }
    const items = await deps.screenings.listByMovieId(movieId);
    return sendJson(200, { ok: true, items });
  }

  return sendError(404, "Not Found");
}
