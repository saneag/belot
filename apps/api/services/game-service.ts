import type { GameMode, Player, RoundScore, Team } from "@belot/types";

import mongoose from "mongoose";

import Game from "../schemas/game-schema";

export type InitGameInput = {
  players: Player[];
  mode: GameMode;
  dealer?: Player | null;
  teams: Team[];
  roundsScores?: RoundScore[];
  undoneRoundsScores?: RoundScore[];
  isFinished?: boolean;
};

export type UpdateGameInput = Partial<{
  dealer: Player | null;
  roundsScores: RoundScore[];
  undoneRoundsScores: RoundScore[];
  isFinished: boolean;
}>;

const toPublicGame = (doc: mongoose.Document) => doc.toJSON() as Record<string, unknown>;

export const GameService = {
  initGame: async (input: InitGameInput) => {
    const doc = await Game.create({
      players: input.players,
      mode: input.mode,
      dealer: input.dealer ?? null,
      teams: input.teams,
      roundsScores: input.roundsScores ?? [],
      undoneRoundsScores: input.undoneRoundsScores ?? [],
      isFinished: input.isFinished ?? false,
    });

    return toPublicGame(doc);
  },

  getGameById: async (id: string) => {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    const doc = await Game.findById(id);
    return doc ? toPublicGame(doc) : null;
  },

  updateGameById: async (id: string, patch: UpdateGameInput) => {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    const $set: Record<string, unknown> = {};

    if ("dealer" in patch) {
      $set.dealer = patch.dealer;
    }
    if ("roundsScores" in patch) {
      $set.roundsScores = patch.roundsScores;
    }
    if ("undoneRoundsScores" in patch) {
      $set.undoneRoundsScores = patch.undoneRoundsScores;
    }
    if ("isFinished" in patch) {
      $set.isFinished = patch.isFinished;
    }

    if (Object.keys($set).length === 0) {
      const existing = await Game.findById(id);
      return existing ? toPublicGame(existing) : null;
    }

    const doc = await Game.findByIdAndUpdate(id, { $set }, { new: true });
    return doc ? toPublicGame(doc) : null;
  },

  listGames: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [total, docs] = await Promise.all([
      Game.countDocuments(),
      Game.find().sort({ updatedAt: -1 }).skip(skip).limit(limit),
    ]);

    return {
      games: docs.map((d) => toPublicGame(d)),
      page,
      limit,
      total,
    };
  },
};
