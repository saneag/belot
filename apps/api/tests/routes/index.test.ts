import type { Application } from "express";
import { describe, expect, it, vi } from "vitest";

import setupRoutes from "../../routes";
import gamesRouter from "../../routes/games-router";

describe("setupRoutes", () => {
  it("registers games router at /games", () => {
    const app = {
      use: vi.fn(),
    } as unknown as Application;

    setupRoutes(app);

    expect(app.use).toHaveBeenCalledWith("/games", gamesRouter);
  });
});
