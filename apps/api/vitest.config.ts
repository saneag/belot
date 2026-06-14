import shared, { coverageSourceExclude } from "@belot/vitest-config";

import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
  shared,
  defineConfig({
    test: {
      name: "@belot/api",
      coverage: {
        exclude: [...coverageSourceExclude, "index.ts", "routes/index.ts"],
      },
    },
  }),
);
