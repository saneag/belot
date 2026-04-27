import mongoose from "mongoose";

/** Must stay aligned with `GameMode` in `@belot/types` (runtime import of that enum breaks under tsx/ESM). */
const GAME_MODES = ["classic", "teams"] as const;

const playerSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    teamId: { type: Number, required: false },
  },
  { _id: false },
);

const teamSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    playersIds: { type: [Number], default: [] },
    name: { type: String, required: true },
  },
  { _id: false },
);

const baseScoreShape = {
  id: { type: Number, required: true },
  score: { type: Number, required: true },
  boltCount: { type: Number, required: true },
  totalScore: { type: Number, required: true },
};

const playerScoreSchema = new mongoose.Schema(
  {
    ...baseScoreShape,
    playerId: { type: Number, required: true },
  },
  { _id: false },
);

const teamScoreSchema = new mongoose.Schema(
  {
    ...baseScoreShape,
    teamId: { type: Number, required: true },
  },
  { _id: false },
);

const roundScoreSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    playersScores: { type: [playerScoreSchema], default: [] },
    teamsScores: { type: [teamScoreSchema], default: [] },
    totalRoundScore: { type: Number, required: true },
    roundPlayer: { type: playerSchema, default: null },
  },
  { _id: false },
);

const gameSchema = new mongoose.Schema(
  {
    players: { type: [playerSchema], required: true },
    mode: {
      type: String,
      enum: GAME_MODES,
      required: true,
    },
    dealer: { type: playerSchema, default: null },
    teams: { type: [teamSchema], default: [] },
    roundsScores: { type: [roundScoreSchema], default: [] },
    undoneRoundsScores: { type: [roundScoreSchema], default: [] },
    isFinished: { type: Boolean, default: false },
  },
  { timestamps: true },
);

gameSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: Record<string, unknown> & { _id?: { toString: () => string } }) => {
    const mongoId = ret._id;
    ret.id = typeof mongoId === "object" && mongoId !== null ? mongoId.toString() : mongoId;
    delete ret._id;
    ret.isFinished = ret.isFinished === true;
    return ret;
  },
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
