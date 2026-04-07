import { describe, expect, it } from "vitest";

describe("games types module", () => {
  it("loads (runtime import from @belot/types)", async () => {
    await import("./games");
    expect(true).toBe(true);
  });
});
