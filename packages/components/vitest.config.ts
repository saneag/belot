import shared from "@belot/vitest-config";

import { defineProject, mergeConfig } from "vitest/config";

export default mergeConfig(
  shared,
  defineProject({
    test: {
      environment: "jsdom",
      name: "@belot/components",
    },
  }),
);
