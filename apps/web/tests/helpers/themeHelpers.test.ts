// @vitest-environment jsdom

import { StorageKeys, THEMES } from "@belot/constants";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { readInitialTheme } from "@/helpers/themeHelpers";

describe("readInitialTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("returns saved dark theme from storage", () => {
    localStorage.setItem(StorageKeys.theme, THEMES.dark);

    expect(readInitialTheme()).toBe(THEMES.dark);
    expect(document.documentElement.classList.contains(THEMES.dark)).toBe(true);
  });

  it("returns saved light theme from storage", () => {
    localStorage.setItem(StorageKeys.theme, THEMES.light);

    expect(readInitialTheme()).toBe(THEMES.light);
    expect(document.documentElement.classList.contains(THEMES.light)).toBe(true);
  });

  it("uses system preference when no theme is saved", () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true }));

    expect(readInitialTheme()).toBe(THEMES.dark);
  });

  it("defaults to light when system prefers light", () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));

    expect(readInitialTheme()).toBe(THEMES.light);
  });
});
