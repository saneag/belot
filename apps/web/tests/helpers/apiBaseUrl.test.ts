import { getApiBaseUrl } from "@/helpers/apiBaseUrl";

import { afterEach, describe, expect, it, vi } from "vitest";

describe("getApiBaseUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns VITE_API_URL when set", () => {
    vi.stubEnv("VITE_API_URL", "https://api.example.com");

    expect(getApiBaseUrl()).toBe("https://api.example.com");
  });

  it("returns empty string when VITE_API_URL is not set", () => {
    vi.stubEnv("VITE_API_URL", undefined);

    expect(getApiBaseUrl()).toBe("");
  });
});
