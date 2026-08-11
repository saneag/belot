import { Application } from "express";

import featureToggleRouter from "./feature-toggle-router.js";
import gamesRouter from "./games-router.js";

export default function setupRoutes(app: Application) {
  app.use("/games", gamesRouter);
  app.use("/feature-toggles", featureToggleRouter);
}
