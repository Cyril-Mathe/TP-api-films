// Implémenter ici le repository `MovieRepository`.
import { Pool } from "pg";
import { Movie } from "../Domain/Movie";

export class MovieRepository {
  constructor(private readonly pool: Pool) {}

  async list(): Promise<Movie[]> {
    const result = await this.pool.query<Movie & { duration_minutes: number; release_date: string | null }>(
      `select id, title, description, duration_minutes, rating, release_date
       from movies order by title asc`
    );
    // map snake_case to camelCase for two fields
    return result.rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      durationMinutes: r.duration_minutes,
      rating: r.rating,
      releaseDate: r.release_date,
    }));
  }
}