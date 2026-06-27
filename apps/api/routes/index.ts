import { Application } from "express";

import featureTogglesRouter from "./feature-toggles-router";
import gamesRouter from "./games-router";

export default function setupRoutes(app: Application) {
  app.use("/feature-toggles", featureTogglesRouter);
  app.use("/games", gamesRouter);
}
