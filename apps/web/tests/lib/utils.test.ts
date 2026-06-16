import { cn } from "@/lib/utils";

import { describe, expect, it } from "vitest";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("resolves conflicting tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles conditional classes", () => {
    const shouldHide = false;
    expect(cn("base", shouldHide && "hidden", "visible")).toBe("base visible");
  });
});
