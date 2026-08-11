import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NotFoundError } from "../../errors/api-error";
import featureToggleRouter from "../../routes/feature-toggle-router";

const mocks = vi.hoisted(() => ({
  getAllFeatureToggles: vi.fn(),
  isFeatureEnabled: vi.fn(),
  createFeatureToggle: vi.fn(),
  getFeatureToggleByName: vi.fn(),
  toggleFeature: vi.fn(),
}));

vi.mock("../../services/feature-toggle-service", () => ({
  FeatureToggleService: {
    getAllFeatureToggles: mocks.getAllFeatureToggles,
    isFeatureEnabled: mocks.isFeatureEnabled,
    createFeatureToggle: mocks.createFeatureToggle,
    getFeatureToggleByName: mocks.getFeatureToggleByName,
    toggleFeature: mocks.toggleFeature,
  },
}));

const app = express();
app.use(express.json());
app.use("/feature-toggles", featureToggleRouter);

describe("feature toggle router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getAllFeatureToggles.mockResolvedValue([]);
    mocks.getFeatureToggleByName.mockResolvedValue(null);
    mocks.createFeatureToggle.mockResolvedValue(undefined);
    mocks.toggleFeature.mockResolvedValue(undefined);
  });

  it("returns all feature toggles", async () => {
    mocks.getAllFeatureToggles.mockResolvedValue([{ name: "score-preview", enabled: true }]);

    const response = await request(app).get("/feature-toggles");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ name: "score-preview", enabled: true }]);
  });

  it("returns whether a feature is enabled", async () => {
    mocks.isFeatureEnabled.mockResolvedValue(true);

    const response = await request(app)
      .get("/feature-toggles/isEnabled")
      .query({ name: "score-preview" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ feature: "score-preview", enabled: true });
    expect(mocks.isFeatureEnabled).toHaveBeenCalledWith("score-preview");
  });

  it("returns the not found status and message from isFeatureEnabled", async () => {
    const featureName = "missing-feature";
    mocks.isFeatureEnabled.mockRejectedValue(
      new NotFoundError(`Feature toggle '${featureName}' not found`),
    );

    const response = await request(app)
      .get("/feature-toggles/isEnabled")
      .query({ name: featureName });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: `Feature toggle '${featureName}' not found` });
  });

  it("returns 400 with a message when the feature name is missing", async () => {
    const response = await request(app).get("/feature-toggles/isEnabled");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Feature name is required" });
  });

  it("returns a success message when a feature is created", async () => {
    const response = await request(app).post("/feature-toggles").send({ name: " new-feature " });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "Feature 'new-feature' has been created" });
    expect(mocks.getFeatureToggleByName).toHaveBeenCalledWith("new-feature");
    expect(mocks.createFeatureToggle).toHaveBeenCalledWith("new-feature");
  });

  it("returns 400 when creating a duplicate feature", async () => {
    mocks.getFeatureToggleByName.mockResolvedValue({ name: "existing-feature", enabled: false });

    const response = await request(app).post("/feature-toggles").send({ name: "existing-feature" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Feature toggle 'existing-feature' already exists" });
    expect(mocks.createFeatureToggle).not.toHaveBeenCalled();
  });

  it("returns 400 when creating a feature with an array body", async () => {
    const response = await request(app).post("/feature-toggles").send([]);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Request body must be a valid JSON object" });
  });

  it("toggles an existing feature", async () => {
    mocks.getFeatureToggleByName.mockResolvedValue({ name: "score-preview", enabled: false });

    const response = await request(app)
      .post("/feature-toggles/toggle")
      .send({ name: "score-preview", enabled: true });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Feature 'score-preview' has been enabled" });
    expect(mocks.toggleFeature).toHaveBeenCalledWith("score-preview", true);
  });

  it("does not update a feature that is already in the requested state", async () => {
    mocks.getFeatureToggleByName.mockResolvedValue({ name: "score-preview", enabled: true });

    const response = await request(app)
      .post("/feature-toggles/toggle")
      .send({ name: "score-preview", enabled: true });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Feature 'score-preview' is already enabled" });
    expect(mocks.toggleFeature).not.toHaveBeenCalled();
  });

  it("returns 400 when toggling a missing feature", async () => {
    const response = await request(app)
      .post("/feature-toggles/toggle")
      .send({ name: "missing-feature", enabled: true });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Feature toggle 'missing-feature' does not exist" });
    expect(mocks.toggleFeature).not.toHaveBeenCalled();
  });

  it("returns 400 when toggle enabled is not a boolean", async () => {
    const response = await request(app)
      .post("/feature-toggles/toggle")
      .send({ name: "score-preview", enabled: "true" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Enabled must be a boolean value" });
  });

  it("continues to return 500 for unexpected service errors", async () => {
    mocks.getAllFeatureToggles.mockRejectedValue(new Error("db down"));

    const response = await request(app).get("/feature-toggles");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });
});
