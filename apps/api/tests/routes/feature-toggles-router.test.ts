import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import featureTogglesRouter from "../../routes/feature-toggles-router";

const mocks = vi.hoisted(() => ({
  listFeatureToggles: vi.fn(),
  setFeatureToggle: vi.fn(),
}));

vi.mock("../../services/feature-toggle-service", () => ({
  FeatureToggleService: {
    listFeatureToggles: mocks.listFeatureToggles,
    setFeatureToggle: mocks.setFeatureToggle,
  },
}));

const app = express();
app.use(express.json());
app.use("/feature-toggles", featureTogglesRouter);

describe("feature toggles router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET / returns feature toggles", async () => {
    const toggles = [{ name: "settings-screen", enabled: true }];
    mocks.listFeatureToggles.mockResolvedValue(toggles);

    const response = await request(app).get("/feature-toggles");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ toggles });
  });

  it("GET / returns 500 on service errors", async () => {
    mocks.listFeatureToggles.mockRejectedValue(new Error("db down"));

    const response = await request(app).get("/feature-toggles");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });

  it("PUT /:name updates a known feature toggle", async () => {
    mocks.setFeatureToggle.mockResolvedValue({ name: "settings-screen", enabled: true });

    const response = await request(app)
      .put("/feature-toggles/settings-screen")
      .send({ enabled: true });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ name: "settings-screen", enabled: true });
    expect(mocks.setFeatureToggle).toHaveBeenCalledWith("settings-screen", true);
  });

  it("PUT /:name rejects invalid toggle names", async () => {
    const response = await request(app).put("/feature-toggles/missing-toggle").send({
      enabled: true,
    });

    expect(response.status).toBe(400);
    expect(mocks.setFeatureToggle).not.toHaveBeenCalled();
  });

  it("PUT /:name rejects invalid enabled values", async () => {
    const response = await request(app).put("/feature-toggles/settings-screen").send({
      enabled: "true",
    });

    expect(response.status).toBe(400);
    expect(mocks.setFeatureToggle).not.toHaveBeenCalled();
  });

  it("PUT /:name rejects unknown body fields", async () => {
    const response = await request(app).put("/feature-toggles/settings-screen").send({
      enabled: true,
      extra: false,
    });

    expect(response.status).toBe(400);
    expect(mocks.setFeatureToggle).not.toHaveBeenCalled();
  });

  it("PUT /:name returns 500 on service errors", async () => {
    mocks.setFeatureToggle.mockRejectedValue(new Error("db down"));

    const response = await request(app)
      .put("/feature-toggles/settings-screen")
      .send({ enabled: true });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });
});
