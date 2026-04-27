import shared from "@belot/vitest-config";

import { defineProject, mergeConfig } from "vitest/config";

export default mergeConfig(
  shared,
  defineProject({
    test: {
      name: "@belot/hooks",
    },
  }),
);
