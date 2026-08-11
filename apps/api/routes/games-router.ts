import { type IRouter, Router } from "express";

import { HttpStatus } from "../constants/http-status.js";
import { sendApiError } from "../middleware/error-handler.js";
import { GameService, type InitGameInput, type UpdateGameInput } from "../services/game-service.js";
import { GameValidators } from "../validators/game-validators.js";

const router: IRouter = Router();

router.post("/init", ...GameValidators.initGame, async (req, res) => {
  try {
    const game = await GameService.initGame(req.body as InitGameInput);
    res.status(HttpStatus.CREATED).json({ id: game.id });
  } catch (error) {
    sendApiError(error, res);
  }
});

router.get("/", ...GameValidators.listGames, async (req, res) => {
  try {
    const page = req.query.page != null ? Number(req.query.page) : 1;
    const limit = req.query.limit != null ? Number(req.query.limit) : 100;

    const result = await GameService.listGames(page, limit);
    res.json(result);
  } catch (error) {
    sendApiError(error, res);
  }
});

router.get("/:id", ...GameValidators.gameIdParam, async (req, res) => {
  try {
    const game = await GameService.getGameById(req.params.id as string);

    if (!game) {
      res.status(HttpStatus.NOT_FOUND).json({ message: "Game not found" });
      return;
    }

    res.json(game);
  } catch (error) {
    sendApiError(error, res);
  }
});

router.patch("/:id", ...GameValidators.updateGame, async (req, res) => {
  try {
    const game = await GameService.updateGameById(
      req.params.id as string,
      req.body as UpdateGameInput,
    );

    if (!game) {
      res.status(HttpStatus.NOT_FOUND).json({ message: "Game not found" });
      return;
    }

    res.json(game);
  } catch (error) {
    sendApiError(error, res);
  }
});

export default router;
