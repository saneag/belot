import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

function TooltipButton(props: {
  onPress?: () => void;
  onLongPress?: () => void;
  onPressOut?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={props.onPress}
      onMouseDown={props.onLongPress}
      onMouseUp={props.onPressOut}
    >
      Btn
    </button>
  );
}

describe("ExtendedTooltip interactions", () => {
  it("handles long press and press out on button", async () => {
    const onLongPress = vi.fn();
    const onPressOut = vi.fn();
    const { default: ExtendedTooltip } = await import("@/components/extendedTooltip");

    render(
      <ExtendedTooltip
        tooltipText="Tooltip"
        button={<TooltipButton onLongPress={onLongPress} onPressOut={onPressOut} />}
      />,
    );

    const button = screen.getByText("Btn");
    fireEvent.mouseDown(button);
    expect(onLongPress).toHaveBeenCalled();

    fireEvent.mouseUp(button);
    expect(onPressOut).toHaveBeenCalled();
  });

  it("returns null trigger for invalid button element", async () => {
    const { default: ExtendedTooltip } = await import("@/components/extendedTooltip");

    const { container } = render(
      <ExtendedTooltip
        tooltipText="Tooltip"
        button={"not-an-element" as unknown as React.ReactElement<Record<string, unknown>>}
      />,
    );

    expect(container.querySelector("button")).toBeNull();
  });
});
