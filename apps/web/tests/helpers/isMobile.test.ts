// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";

import { isMobile } from "@/helpers/isMobile";

describe("isMobile", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns true for mobile user agents", () => {
    vi.stubGlobal("navigator", { userAgent: "Mozilla/5.0 (Linux; Android 10)" });
    Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });

    expect(isMobile()).toBe(true);
  });

  it("returns true for small screens", () => {
    vi.stubGlobal("navigator", { userAgent: "Mozilla/5.0 (Macintosh)" });
    Object.defineProperty(window, "innerWidth", { value: 500, configurable: true });

    expect(isMobile()).toBe(true);
  });

  it("returns false for desktop with large screen", () => {
    vi.stubGlobal("navigator", { userAgent: "Mozilla/5.0 (Macintosh)" });
    Object.defineProperty(window, "innerWidth", { value: 1200, configurable: true });

    expect(isMobile()).toBe(false);
  });
});
