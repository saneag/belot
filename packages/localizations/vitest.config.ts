import { defineProject, mergeConfig } from "vitest/config";
import shared from "@belot/vitest-config";

export default mergeConfig(
  shared,
  defineProject({
    test: {
      name: "@belot/localizations",
    },
  }),
);
