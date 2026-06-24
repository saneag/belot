import { describe, expect, it } from "vitest";

import { formatRemainingTime } from "../../src/devtools/formatRemainingTime";

describe("formatRemainingTime", () => {
  it("formats milliseconds as rounded-up minutes and seconds", () => {
    expect(formatRemainingTime(0)).toBe("0:00");
    expect(formatRemainingTime(1)).toBe("0:01");
    expect(formatRemainingTime(61_000)).toBe("1:01");
  });
});
