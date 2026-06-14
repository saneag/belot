import { describe, expect, it } from "vitest";

import {
  formatLocalizationKey,
  formatLocalizationString,
} from "../src/hooks/useLocalization";

describe("localization formatting", () => {
  it("formats localization keys into camelCase property names", () => {
    expect(formatLocalizationKey("confirmation.dialog.confirm.button")).toBe(
      "confirmationDialogConfirmButton",
    );
    expect(formatLocalizationKey("time")).toBe("time");
  });

  it("replaces positional arguments in localization strings", () => {
    expect(formatLocalizationString("Hello {0}", ["Alice"])).toBe("Hello Alice");
    expect(formatLocalizationString("Hello {0}", [])).toBe("Hello {0}");
  });
});
