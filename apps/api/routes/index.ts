import { Application } from "express";

import gamesRouter from "./games-router";

export default function setupRoutes(app: Application) {
  app.use("/games", gamesRouter);
}
