import { describe, expect, it } from "vitest";

import { getAuthErrorLocalizationKey } from "../src/authErrors";

describe("getAuthErrorLocalizationKey", () => {
  it.each([
    ["Username, email, and password are required", "auth.error.fields.required"],
    ["Identifier and password are required", "auth.error.fields.required"],
    ["Invalid credentials", "auth.error.invalid.credentials"],
    [
      "Username must be at least 3 characters and contain only English letters, numbers, underscores, or hyphens.",
      "auth.error.username.invalid",
    ],
    ["Email is invalid", "auth.error.email.invalid"],
    ["Password must be at least 8 characters", "auth.error.password.short"],
    ["Unable to create account with those details", "auth.error.account.create"],
  ] as const)("maps %s to %s", (message, key) => {
    expect(getAuthErrorLocalizationKey(new Error(message))).toBe(key);
  });

  it.each([new Error("Unexpected error"), "Unexpected error", null, undefined])(
    "uses the generic key for an unmapped error: %s",
    (error) => {
      expect(getAuthErrorLocalizationKey(error)).toBe("auth.error.generic");
    },
  );
});
