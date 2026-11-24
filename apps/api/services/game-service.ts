import type { GameMode, Player, RoundScore, Team } from "@belot/types";

import { randomBytes } from "node:crypto";

import { pool } from "../config/postgres.js";

export type InitGameInput = {
  players: Player[];
  mode: GameMode;
  dealer?: Player | null;
  teams: Team[];
};
export type UpdateGameInput = Partial<{
  dealer: Player | null;
  roundsScores: RoundScore[];
  undoneRoundsScores: RoundScore[];
  isFinished: boolean;
}>;
type GameRow = { id: string; data: Record<string, unknown>; created_at: Date; updated_at: Date };
const publicGame = (row: GameRow) => ({
  ...row.data,
  id: row.id,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
});
export const GameService = {
  initGame: async (input: InitGameInput) => {
    // Preserve the public ID format used by existing clients.
    const id = randomBytes(12).toString("hex");
    const data = {
      ...input,
      dealer: input.dealer ?? null,
      roundsScores: [],
      undoneRoundsScores: [],
      isFinished: false,
    };
    const result = await pool.query<GameRow>(
      "INSERT INTO games (id, data) VALUES ($1, $2) RETURNING *",
      [id, data],
    );
    return publicGame(result.rows[0]!);
  },
  getGameById: async (id: string) => {
    if (!/^[a-f\d]{24}$/i.test(id)) return null;
    const result = await pool.query<GameRow>("SELECT * FROM games WHERE id = $1", [
      id.toLowerCase(),
    ]);
    return result.rows[0] ? publicGame(result.rows[0]) : null;
  },
  updateGameById: async (id: string, patch: UpdateGameInput) => {
    if (!/^[a-f\d]{24}$/i.test(id)) return null;
    const data: UpdateGameInput = {};
    for (const key of ["dealer", "roundsScores", "undoneRoundsScores", "isFinished"] as const) {
      if (key in patch) Object.assign(data, { [key]: patch[key] });
    }
    if (!Object.keys(data).length) return GameService.getGameById(id);
    const result = await pool.query<GameRow>(
      "UPDATE games SET data = data || $2::jsonb, updated_at = now() WHERE id = $1 RETURNING *",
      [id.toLowerCase(), data],
    );
    return result.rows[0] ? publicGame(result.rows[0]) : null;
  },
  listGames: async (page: number, limit: number) => {
    const [count, result] = await Promise.all([
      pool.query<{ total: string }>("SELECT count(*) AS total FROM games"),
      pool.query<GameRow>("SELECT * FROM games ORDER BY updated_at DESC, id LIMIT $1 OFFSET $2", [
        limit,
        (page - 1) * limit,
      ]),
    ]);
    return { games: result.rows.map(publicGame), page, limit, total: Number(count.rows[0]!.total) };
  },
};
