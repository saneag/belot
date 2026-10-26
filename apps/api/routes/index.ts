import { Application } from "express";

import authRouter from "./auth-router.js";
import featureToggleRouter from "./feature-toggle-router.js";
import gamesRouter from "./games-router.js";

export default function setupRoutes(app: Application) {
  app.use("/games", gamesRouter);
  app.use("/auth", authRouter);
  app.use("/feature-toggles", featureToggleRouter);
}
