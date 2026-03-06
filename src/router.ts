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

import type { Pool } from "pg";
import { MovieRepository } from "./Infrastructure/MovieRepository";
import { ScreeningRepository } from "./Infrastructure/ScreeningRepository";
import type { Express, Request, Response } from "express";

export type RouterDeps = {
  pool: Pool;
  movies: MovieRepository;
  screenings: ScreeningRepository;
};

export function router(app: Express, deps: RouterDeps): void {
  function sendJson(res: Response, status: number, data: unknown): void {
    res.status(status).json(data);
  }

  function sendError(res: Response, status: number, message: string): void {
    sendJson(res, status, { ok: false, error: message });
  }

  app.get("/", (req: Request, res: Response) => {
    sendJson(res, 200, { ok: true, message: "Movie API" });
  });

  app.get("/health", (req: Request, res: Response) => {
    sendJson(res, 200, { ok: true });
  });

  app.get("/movies", async (req: Request, res: Response) => {
    const items = await deps.movies.list();
    sendJson(res, 200, { ok: true, items });
  });

  app.get("/movies/:id/screenings", async (req: Request, res: Response) => {
    const movieId = Number(req.params.id);
    if (Number.isNaN(movieId)) {
      return sendError(res, 400, "Invalid movie id");
    }
    const items = await deps.screenings.listByMovieId(movieId);
    sendJson(res, 200, { ok: true, items });
  });

  app.use((req: Request, res: Response) => {
    sendError(res, 404, "Not Found");
  });
}