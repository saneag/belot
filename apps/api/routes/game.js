import express from "express";

import Game from "../schemas/game-schema.js";

const router = express.Router();

router.post("/init", async (req, res) => {
  const {
    players,
    teams,
    mode,
    hasPreviousGame,
    dealer,
    roundPlayer,
    roundsScores,
    undoneRoundsScores,
  } = req.body;

  const game = new Game({
    players,
    teams,
    mode,
    hasPreviousGame,
    dealer,
    roundPlayer,
    roundsScores,
    undoneRoundsScores,
  });
  await game.save();

  res.status(200).json({ message: "Game initialized successfully" });
});

export default router;
