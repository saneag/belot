// @vitest-environment jsdom
import ExtendedTooltip from "@/components/extendedTooltip";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("ExtendedTooltip", () => {
  it("renders button and tooltip text", () => {
    const onPress = vi.fn();

    render(
      <ExtendedTooltip
        tooltipText="Help text"
        button={
          <button type="button" onClick={onPress}>
            Action
          </button>
        }
      />,
    );

    expect(screen.getByText("Action")).toBeTruthy();
    expect(screen.getByText("Help text")).toBeTruthy();
  });

  it("handles long press and press out", () => {
    render(<ExtendedTooltip tooltipText="Tooltip" button={<button type="button">Btn</button>} />);

    const button = screen.getByText("Btn");
    fireEvent.click(button);
    fireEvent.mouseDown(button);
  });
});
