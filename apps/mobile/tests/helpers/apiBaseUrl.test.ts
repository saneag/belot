import { describe, expect, it } from "vitest";

import { getApiBaseUrl } from "@/helpers/apiBaseUrl";

describe("getApiBaseUrl", () => {
  it("returns env value when set", () => {
    const original = process.env.EXPO_PUBLIC_API_BASE_URL;
    process.env.EXPO_PUBLIC_API_BASE_URL = "https://api.example.com";
    expect(getApiBaseUrl()).toBe("https://api.example.com");
    process.env.EXPO_PUBLIC_API_BASE_URL = original;
  });

  it("returns empty string when env is unset", () => {
    const original = process.env.EXPO_PUBLIC_API_BASE_URL;
    delete process.env.EXPO_PUBLIC_API_BASE_URL;
    expect(getApiBaseUrl()).toBe("");
    process.env.EXPO_PUBLIC_API_BASE_URL = original;
  });
});
