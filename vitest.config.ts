import { coverageSourceExclude } from "@belot/vitest-config";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      exclude: [...coverageSourceExclude],
    },
    projects: [
      "packages/*/vitest.config.ts",
      "apps/*/vitest.config.ts",
    ],
  },
});
