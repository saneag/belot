import { POINTS_TYPE } from "@belot/constants";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@belot/hooks", () => ({
  usePointsTypeSelection: ({ onChange }: { onChange: (value: string) => void }) => ({
    handleChange: onChange,
    getOptionLabel: (key: string) => key,
  }),
}));

describe("DialogPointsTypeToggle", () => {
  it("renders options and forwards changes", async () => {
    const onChange = vi.fn();
    const { default: DialogPointsTypeToggle } =
      await import("@/components/game-table/action-buttons/next-round-button/dialogPointsTypeToggle");

    render(<DialogPointsTypeToggle value={POINTS_TYPE[0].id} onChange={onChange} />);

    expect(screen.getByText(POINTS_TYPE[0].localizationKey)).toBeTruthy();
    fireEvent.click(screen.getByText(POINTS_TYPE[1].localizationKey));

    expect(onChange).toHaveBeenCalledWith(POINTS_TYPE[1].id);
  });
});
