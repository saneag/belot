import type { Application } from "express";
import { describe, expect, it, vi } from "vitest";

import setupRoutes from "../../routes";
import featureToggleRouter from "../../routes/feature-toggle-router";
import gamesRouter from "../../routes/games-router";

describe("setupRoutes", () => {
  it("registers games router at /games", () => {
    const app = {
      use: vi.fn(),
    } as unknown as Application;

    setupRoutes(app);

    expect(app.use).toHaveBeenCalledWith("/games", gamesRouter);
  });

  it("registers feature toggle router at /feature-toggles", () => {
    const app = {
      use: vi.fn(),
    } as unknown as Application;

    setupRoutes(app);

    expect(app.use).toHaveBeenCalledWith("/feature-toggles", featureToggleRouter);
  });
});
