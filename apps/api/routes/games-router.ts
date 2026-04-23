import { Router } from "express";

import { GameService, type InitGameInput, type UpdateGameInput } from "../services/game-service";
import { GameValidators } from "../validators/game-validators";

const router = Router();

router.post("/init", ...GameValidators.initGame, async (req, res) => {
  try {
    const game = await GameService.initGame(req.body as InitGameInput);
    res.status(201).json({ id: game.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", ...GameValidators.listGames, async (req, res) => {
  try {
    const page = req.query.page != null ? Number(req.query.page) : 1;
    const limit = req.query.limit != null ? Number(req.query.limit) : 100;

    const result = await GameService.listGames(page, limit);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", ...GameValidators.gameIdParam, async (req, res) => {
  try {
    const game = await GameService.getGameById(req.params.id as string);

    if (!game) {
      res.status(404).json({ message: "Game not found" });
      return;
    }

    res.json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/:id", ...GameValidators.updateGame, async (req, res) => {
  try {
    const game = await GameService.updateGameById(
      req.params.id as string,
      req.body as UpdateGameInput,
    );

    if (!game) {
      res.status(404).json({ message: "Game not found" });
      return;
    }

    res.json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
