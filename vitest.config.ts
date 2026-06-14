import { coverageSourceExclude } from "@belot/vitest-config";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      include: ["**/*.{ts,tsx}"],
      exclude: [
        ...coverageSourceExclude,
        "apps/api/index.ts",
        "apps/mobile/components/ui/**",
        "apps/mobile/app/index.tsx",
        "apps/web/src/components/ui/**",
        "apps/web/src/main.tsx",
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
    projects: ["packages/*/vitest.config.ts", "apps/*/vitest.config.ts"],
  },
});
