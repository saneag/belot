import { defineConfig } from "vitest/config";

/** Shared defaults merged into each package/app `defineProject` config. */
export default defineConfig({
  test: {
    passWithNoTests: true,
  },
});
