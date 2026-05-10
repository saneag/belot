import { defineConfig } from "vitest/config";

/** Used by workspace root so merged coverage omits tests/mocks without forcing a global `include` glob. */
export const coverageSourceExclude = [
  "**/*.d.ts",
  "**/*.{test,spec}.{ts,tsx}",
  "**/__tests__/**",
  "**/test/**",
  "**/tests/**",
  "**/__mocks__/**",
  "**/mocks/**",
] as const;

/** Shared defaults merged into each package/app `defineProject` config. */
export default defineConfig({
  test: {
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      include: ["**/*.{ts,tsx}"],
      exclude: [...coverageSourceExclude],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
  },
});
