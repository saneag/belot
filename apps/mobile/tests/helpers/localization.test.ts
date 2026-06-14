import { beforeEach, describe, expect, it, vi } from "vitest";

const getLocales = vi.fn();

vi.mock("expo-localization", () => ({
  getLocales,
}));

describe("getDeviceLanguage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns first locale language tag", async () => {
    getLocales.mockReturnValue([{ languageTag: "bg-BG" }]);
    const { getDeviceLanguage } = await import("@/helpers/localization");
    expect(getDeviceLanguage()).toBe("bg-BG");
  });

  it("falls back to en when language tag is missing", async () => {
    getLocales.mockReturnValue([{ languageTag: "" }]);
    const { getDeviceLanguage } = await import("@/helpers/localization");
    expect(getDeviceLanguage()).toBe("en");
  });
});
