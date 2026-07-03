import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiFetch } from "../../src/services/client";
import {
  buildFeatureTogglesUrl,
  getFeatureToggles,
  updateFeatureToggle,
} from "../../src/services/feature-toggles";

vi.mock("../../src/services/client", () => ({
  apiFetch: vi.fn(),
}));

const apiFetchMock = vi.mocked(apiFetch);

describe("buildFeatureTogglesUrl", () => {
  it("normalizes trailing slash and builds feature toggles URL", () => {
    expect(buildFeatureTogglesUrl("https://api.example/")).toBe(
      "https://api.example/feature-toggles",
    );
    expect(buildFeatureTogglesUrl("https://api.example")).toBe(
      "https://api.example/feature-toggles",
    );
  });
});

describe("getFeatureToggles", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("calls apiFetch with the feature toggles URL", async () => {
    const response = { toggles: [{ name: "settings-screen", enabled: true }] };
    apiFetchMock.mockResolvedValue(response);

    await expect(getFeatureToggles("https://api.example")).resolves.toBe(response);
    expect(apiFetchMock).toHaveBeenCalledWith("https://api.example/feature-toggles");
  });
});

describe("updateFeatureToggle", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("PUTs JSON to the named feature toggle endpoint", async () => {
    apiFetchMock.mockResolvedValue({ name: "settings-screen", enabled: true });

    await expect(
      updateFeatureToggle("https://api.example", "settings-screen", true),
    ).resolves.toEqual({
      name: "settings-screen",
      enabled: true,
    });

    expect(apiFetchMock).toHaveBeenCalledWith(
      "https://api.example/feature-toggles/settings-screen",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enabled: true }),
      },
    );
  });
});
