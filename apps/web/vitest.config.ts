import shared, { coverageSourceExclude } from "@belot/vitest-config";

import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default mergeConfig(
  mergeConfig(viteConfig, shared),
  defineConfig({
    test: {
      name: "@belot/web",
      setupFiles: ["./tests/setup.ts"],
      coverage: {
        exclude: [...coverageSourceExclude, "src/components/ui/**", "src/main.tsx"],
      },
    },
  }),
);
