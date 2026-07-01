import { Application } from "express";

import gamesRouter from "./games-router.js";

export default function setupRoutes(app: Application) {
  app.use("/games", gamesRouter);
}
