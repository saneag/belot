// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PlayersNamesInputWrapper } from "../src/playersNamesInputWrapper";

vi.mock("@belot/hooks", () => ({
  useGetInputPosition: () => ({
    getTopPosition: () => "10px",
    getRightPosition: () => "20px",
    getRotation: () => "rotate(45deg)",
  }),
}));

describe("PlayersNamesInputWrapper", () => {
  it("positions children using hook helpers", () => {
    const { container } = render(
      <PlayersNamesInputWrapper blockWrapper="div" index={1} playersCount={4}>
        <span>input</span>
      </PlayersNamesInputWrapper>,
    );

    const wrapper = container.querySelector("div");
    expect(wrapper?.className).toContain("absolute");
    expect(wrapper?.style.top).toBe("10px");
    expect(wrapper?.style.right).toBe("20px");
    expect(wrapper?.style.transform).toBe("rotate(45deg)");
    expect(container.textContent).toBe("input");
  });
});
