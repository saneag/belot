import mongoose from "mongoose";

import PlayerSchema from "./player-schema.js";
import TeamSchema from "./team-schema.js";

export default new mongoose.Schema({
  score: {
    type: Number,
    required: true,
  },
  boltCount: {
    type: Number,
    required: true,
  },
  totalScore: {
    type: Number,
    required: true,
  },
  playersScores: [PlayerSchema],
  teamsScores: [TeamSchema],
});
