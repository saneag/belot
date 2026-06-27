import { FEATURE_TOGGLES } from "@belot/constants";

import { describe, expect, it } from "vitest";

import FeatureToggle from "../../schemas/feature-toggle-schema";

describe("feature toggle schema", () => {
  it("serializes documents without Mongo internals", () => {
    const json = new FeatureToggle({
      name: "settings-screen",
      enabled: true,
    }).toJSON() as Record<string, unknown>;

    expect(json).toMatchObject({
      name: "settings-screen",
      enabled: true,
    });
    expect(json._id).toBeUndefined();
    expect(json.__v).toBeUndefined();
  });

  it("enforces known feature toggle names", () => {
    const knownToggle = new FeatureToggle({
      name: Object.keys(FEATURE_TOGGLES)[0],
      enabled: false,
    });
    const unknownToggle = new FeatureToggle({ name: "unknown-toggle", enabled: false });

    expect(knownToggle.validateSync()).toBeUndefined();
    expect(unknownToggle.validateSync()?.errors.name).toBeDefined();
  });
});
