import mongoose from "mongoose";

import PlayerSchema from "./player-schema.js";
import RoundSchema from "./round-schema.js";
import TeamSchema from "./team-schema.js";

const gameSchema = new mongoose.Schema({
  players: [PlayerSchema],
  teams: [TeamSchema],
  mode: {
    type: String,
    required: true,
  },
  hasPreviousGame: {
    type: Boolean,
    required: true,
  },
  dealer: {
    type: String,
    required: true,
  },
  roundPlayer: {
    type: String,
    required: true,
  },
  roundsScores: [RoundSchema],
  undoneRoundsScores: [RoundSchema],
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
