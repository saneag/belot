import { beforeEach, describe, expect, it, vi } from "vitest";

import { FeatureToggleService } from "../../services/feature-toggle-service";

const { query } = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock("../../config/postgres.js", () => ({ pool: { query } }));
describe("PostgreSQL feature toggles", () => {
  beforeEach(() => query.mockReset());
  it("returns false for disabled toggles", async () => {
    query.mockResolvedValue({ rows: [{ name: "test", enabled: false }] });
    expect(await FeatureToggleService.isFeatureEnabled("test")).toBe(false);
  });
  it("reports missing toggles", async () => {
    query.mockResolvedValue({ rows: [] });
    await expect(FeatureToggleService.isFeatureEnabled("missing")).rejects.toThrow("not found");
  });
  it("passes hostile names as parameters", async () => {
    query.mockResolvedValue({ rows: [] });
    await FeatureToggleService.createFeatureToggle("'; DROP TABLE games; --");
    expect(query.mock.calls[0]![1]).toEqual(["'; DROP TABLE games; --"]);
  });
});
