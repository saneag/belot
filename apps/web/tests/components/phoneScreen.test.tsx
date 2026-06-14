// @vitest-environment jsdom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PhoneScreen from "@/components/phoneScreen";

const mobileMocks = vi.hoisted(() => ({
  isMobile: false,
}));

vi.mock("@/helpers/isMobile", () => ({
  isMobile: () => mobileMocks.isMobile,
}));

describe("PhoneScreen", () => {
  it("renders children inside the desktop phone frame", () => {
    mobileMocks.isMobile = false;

    const { container } = render(
      <PhoneScreen>
        <span>content</span>
      </PhoneScreen>,
    );

    expect(container.textContent).toBe("content");
    expect(container.firstElementChild?.className).toContain("h-[80vh]");
  });

  it("uses full screen height on mobile", () => {
    mobileMocks.isMobile = true;

    const { container } = render(
      <PhoneScreen>
        <span>mobile</span>
      </PhoneScreen>,
    );

    expect(container.firstElementChild?.className).toContain("h-dvh");
    expect(container.firstElementChild?.className).toContain("max-h-dvh");
  });
});
