import shared, { coverageSourceExclude } from "@belot/vitest-config";

import path from "node:path";
import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
  shared,
  defineConfig({
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    esbuild: {
      jsx: "automatic",
    },
    test: {
      name: "@belot/mobile",
      setupFiles: ["./tests/setup.ts"],
      coverage: {
        exclude: [...coverageSourceExclude, "components/ui/**", "app/index.tsx"],
      },
    },
  }),
);
