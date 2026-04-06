import { defineProject, mergeConfig } from "vitest/config";
import shared from "@belot/vitest-config";
import viteConfig from "./vite.config";

export default mergeConfig(
  mergeConfig(viteConfig, shared),
  defineProject({
    test: {
      name: "@belot/web",
    },
  }),
);
