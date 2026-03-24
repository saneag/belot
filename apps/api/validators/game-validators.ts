import { NextFunction, Request, Response } from "express";
import { body, param, query, validationResult } from "express-validator";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validatePlayer(value: unknown, path: string): void {
  if (!isPlainObject(value)) {
    throw new Error(`${path} must be an object`);
  }
  if (typeof value.id !== "number") {
    throw new Error(`${path}.id must be a number`);
  }
  if (typeof value.name !== "string") {
    throw new Error(`${path}.name must be a string`);
  }
  if (value.teamId !== undefined && typeof value.teamId !== "number") {
    throw new Error(`${path}.teamId must be a number when provided`);
  }
}

function validateTeam(value: unknown, path: string): void {
  if (!isPlainObject(value)) {
    throw new Error(`${path} must be an object`);
  }
  if (typeof value.id !== "number") {
    throw new Error(`${path}.id must be a number`);
  }
  if (typeof value.name !== "string") {
    throw new Error(`${path}.name must be a string`);
  }
  if (!Array.isArray(value.playersIds)) {
    throw new Error(`${path}.playersIds must be an array`);
  }
  if (!value.playersIds.every((id: unknown) => typeof id === "number")) {
    throw new Error(`${path}.playersIds must contain only numbers`);
  }
}

function validateBaseScore(value: unknown, path: string): void {
  if (!isPlainObject(value)) {
    throw new Error(`${path} must be an object`);
  }
  for (const key of ["id", "score", "boltCount", "totalScore"] as const) {
    if (typeof value[key] !== "number") {
      throw new Error(`${path}.${key} must be a number`);
    }
  }
}

function validatePlayerScore(value: unknown, path: string): void {
  validateBaseScore(value, path);
  const o = value as Record<string, unknown>;
  if (typeof o.playerId !== "number") {
    throw new Error(`${path}.playerId must be a number`);
  }
}

function validateTeamScore(value: unknown, path: string): void {
  validateBaseScore(value, path);
  const o = value as Record<string, unknown>;
  if (typeof o.teamId !== "number") {
    throw new Error(`${path}.teamId must be a number`);
  }
}

function validateRoundScore(value: unknown, path: string): void {
  if (!isPlainObject(value)) {
    throw new Error(`${path} must be an object`);
  }
  if (typeof value.id !== "number") {
    throw new Error(`${path}.id must be a number`);
  }
  if (typeof value.totalRoundScore !== "number") {
    throw new Error(`${path}.totalRoundScore must be a number`);
  }
  if (!Array.isArray(value.playersScores)) {
    throw new Error(`${path}.playersScores must be an array`);
  }
  value.playersScores.forEach((row, i) => validatePlayerScore(row, `${path}.playersScores[${i}]`));
  if (!Array.isArray(value.teamsScores)) {
    throw new Error(`${path}.teamsScores must be an array`);
  }
  value.teamsScores.forEach((row, i) => validateTeamScore(row, `${path}.teamsScores[${i}]`));
  if (value.roundPlayer !== undefined && value.roundPlayer !== null) {
    validatePlayer(value.roundPlayer, `${path}.roundPlayer`);
  }
}

function sendValidationErrors(req: Request, res: Response, next: NextFunction): Response | void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const GameValidators = {
  initGame: [
    body("players")
      .isArray({ min: 2, max: 4 })
      .withMessage("players must be an array of 2 to 4 players"),
    body("players").custom((players: unknown) => {
      if (!Array.isArray(players)) {
        throw new Error("players must be an array");
      }
      players.forEach((p, i) => validatePlayer(p, `players[${i}]`));
      if (players.length === 4) {
        const allHaveTeam = players.every(
          (player: Record<string, unknown>) => typeof player.teamId === "number",
        );
        if (!allHaveTeam) {
          throw new Error("Each player must have teamId when there are 4 players");
        }
      }
      return true;
    }),
    body("mode")
      .isString()
      .isIn(["classic", "teams"])
      .withMessage("mode must be either 'classic' or 'teams'"),
    body("dealer").optional({ values: "null" }).custom((v: unknown) => {
      if (v === null || v === undefined) {
        return true;
      }
      validatePlayer(v, "dealer");
      return true;
    }),
    body("teams")
      .isArray()
      .withMessage("teams must be an array")
      .custom((teams: unknown) => {
        if (!Array.isArray(teams)) {
          throw new Error("teams must be an array");
        }
        teams.forEach((t, i) => validateTeam(t, `teams[${i}]`));
        return true;
      }),
    body("roundsScores")
      .optional()
      .isArray()
      .withMessage("roundsScores must be an array")
      .custom((rounds: unknown) => {
        if (rounds === undefined) {
          return true;
        }
        if (!Array.isArray(rounds)) {
          throw new Error("roundsScores must be an array");
        }
        rounds.forEach((r, i) => validateRoundScore(r, `roundsScores[${i}]`));
        return true;
      }),
    body("undoneRoundsScores")
      .optional()
      .isArray()
      .custom((rounds: unknown) => {
        if (rounds === undefined) {
          return true;
        }
        if (!Array.isArray(rounds)) {
          throw new Error("undoneRoundsScores must be an array");
        }
        rounds.forEach((r, i) => validateRoundScore(r, `undoneRoundsScores[${i}]`));
        return true;
      }),
    body("isFinished").optional().isBoolean(),
    sendValidationErrors,
  ],

  updateGame: [
    param("id").isMongoId().withMessage("id must be a valid MongoDB ObjectId"),
    body().custom((bodyValue: Record<string, unknown>) => {
      const allowed = ["dealer", "roundsScores", "undoneRoundsScores", "isFinished"] as const;
      const keys = Object.keys(bodyValue ?? {});
      const unknown = keys.filter((k) => !allowed.includes(k as (typeof allowed)[number]));
      if (unknown.length > 0) {
        throw new Error(`Unknown fields: ${unknown.join(", ")}`);
      }
      if (keys.length === 0) {
        throw new Error("At least one field is required");
      }
      return true;
    }),
    body("dealer").optional({ values: "null" }).custom((v: unknown) => {
      if (v === null || v === undefined) {
        return true;
      }
      validatePlayer(v, "dealer");
      return true;
    }),
    body("roundsScores")
      .optional()
      .isArray()
      .custom((rounds: unknown) => {
        if (rounds === undefined) {
          return true;
        }
        if (!Array.isArray(rounds)) {
          throw new Error("roundsScores must be an array");
        }
        rounds.forEach((r, i) => validateRoundScore(r, `roundsScores[${i}]`));
        return true;
      }),
    body("undoneRoundsScores")
      .optional()
      .isArray()
      .custom((rounds: unknown) => {
        if (rounds === undefined) {
          return true;
        }
        if (!Array.isArray(rounds)) {
          throw new Error("undoneRoundsScores must be an array");
        }
        rounds.forEach((r, i) => validateRoundScore(r, `undoneRoundsScores[${i}]`));
        return true;
      }),
    body("isFinished").optional().isBoolean(),
    sendValidationErrors,
  ],

  listGames: [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    sendValidationErrors,
  ],

  gameIdParam: [
    param("id").isMongoId().withMessage("id must be a valid MongoDB ObjectId"),
    sendValidationErrors,
  ],
};
