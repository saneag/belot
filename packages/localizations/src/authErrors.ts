import type { LocalizationKey } from "./types";

const AUTH_ERROR_KEYS: Record<string, LocalizationKey> = {
  "Username, email, and password are required": "auth.error.fields.required",
  "Identifier and password are required": "auth.error.fields.required",
  "Invalid credentials": "auth.error.invalid.credentials",
  "Username must be at least 3 characters and contain only English letters, numbers, underscores, or hyphens.":
    "auth.error.username.invalid",
  "Email is invalid": "auth.error.email.invalid",
  "Password must be at least 8 characters": "auth.error.password.short",
  "Unable to create account with those details": "auth.error.account.create",
};

export const getAuthErrorLocalizationKey = (error: unknown): LocalizationKey => {
  if (!(error instanceof Error)) return "auth.error.generic";
  return AUTH_ERROR_KEYS[error.message] ?? "auth.error.generic";
};
