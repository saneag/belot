import { getDeviceLanguage } from "@/helpers/localization";

import { afterEach, describe, expect, it, vi } from "vitest";

describe("getDeviceLanguage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the first navigator language when available", () => {
    vi.stubGlobal("navigator", { languages: ["bg-BG", "en-US"], language: "en-US" });

    expect(getDeviceLanguage()).toBe("bg-BG");
  });

  it("falls back to navigator.language", () => {
    vi.stubGlobal("navigator", { language: "de-DE" });

    expect(getDeviceLanguage()).toBe("de-DE");
  });

  it("defaults to en when no language is available", () => {
    vi.stubGlobal("navigator", {});

    expect(getDeviceLanguage()).toBe("en");
  });
});
