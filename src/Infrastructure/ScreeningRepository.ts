// Implémenter ici le repository `ScreeningRepository`.
import { Pool } from "pg";
import { Screening } from "../Domain/Screening";

export class ScreeningRepository {
  constructor(private readonly pool: Pool) {}

  async listByMovieId(movieId: number): Promise<Screening[]> {
    const result = await this.pool.query<Screening & { movie_id: number; start_time: string; room: any }>(
      `select
         s.id,
         s.movie_id as "movieId",
         s.start_time::text as "startTime",
         s.price,
         json_build_object(
           'id', r.id,
           'name', r.name,
           'capacity', r.capacity
         ) as room
       from screenings s
       join rooms r on r.id = s.room_id
       where s.movie_id = $1
       order by s.start_time asc`,
      [movieId]
    );
    return result.rows.map((r) => ({
      id: r.id,
      movieId: r.movieId,
      startTime: r.startTime,
      price: r.price,
      room: r.room,
    }));
  }
}