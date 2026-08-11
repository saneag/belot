import { beforeEach, describe, expect, it, vi } from "vitest";

import { NotFoundError } from "../../errors/api-error";
import { FeatureToggleService } from "../../services/feature-toggle-service";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  find: vi.fn(),
  findOne: vi.fn(),
  updateOne: vi.fn(),
}));

vi.mock("../../schemas/feature-toggle-schema.js", () => ({
  default: {
    create: mocks.create,
    find: mocks.find,
    findOne: mocks.findOne,
    updateOne: mocks.updateOne,
  },
}));

describe("FeatureToggleService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates disabled feature toggles", async () => {
    mocks.create.mockResolvedValue(undefined);

    await FeatureToggleService.createFeatureToggle("score-preview");

    expect(mocks.create).toHaveBeenCalledWith({ name: "score-preview", enabled: false });
  });

  it("returns whether a feature is enabled", async () => {
    mocks.findOne.mockResolvedValue({ name: "score-preview", enabled: true });

    await expect(FeatureToggleService.isFeatureEnabled("score-preview")).resolves.toBe(true);
    expect(mocks.findOne).toHaveBeenCalledWith({ name: "score-preview" });
  });

  it("throws when checking a missing feature", async () => {
    mocks.findOne.mockResolvedValue(null);

    await expect(FeatureToggleService.isFeatureEnabled("missing-feature")).rejects.toThrow(
      new NotFoundError("Feature toggle 'missing-feature' not found"),
    );
  });

  it("updates an existing feature without upserting", async () => {
    mocks.updateOne.mockResolvedValue(undefined);

    await FeatureToggleService.toggleFeature("score-preview", true);

    expect(mocks.updateOne).toHaveBeenCalledWith(
      { name: "score-preview" },
      { $set: { enabled: true } },
    );
  });

  it("returns all feature toggles", async () => {
    mocks.find.mockResolvedValue([
      { name: "score-preview", enabled: true },
      { name: "new-table", enabled: false },
    ]);

    await expect(FeatureToggleService.getAllFeatureToggles()).resolves.toEqual([
      { name: "score-preview", enabled: true },
      { name: "new-table", enabled: false },
    ]);
  });

  it("returns a feature toggle by name", async () => {
    mocks.findOne.mockResolvedValue({ name: "score-preview", enabled: false });

    await expect(FeatureToggleService.getFeatureToggleByName("score-preview")).resolves.toEqual({
      name: "score-preview",
      enabled: false,
    });
  });

  it("returns null when a feature toggle by name is missing", async () => {
    mocks.findOne.mockResolvedValue(null);

    await expect(
      FeatureToggleService.getFeatureToggleByName("missing-feature"),
    ).resolves.toBeNull();
  });
});
