import { POINTS_TYPE } from "@belot/constants";

import DialogPointsTypeToggle from "@/components/game-table/action-buttons/next-round-button/dialogPointsTypeToggle";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@belot/hooks", () => ({
  usePointsTypeSelection: ({ onChange }: { onChange: (value: string) => void }) => ({
    handleChange: onChange,
    getOptionLabel: (key: string) => key,
  }),
}));

describe("DialogPointsTypeToggle", () => {
  it("renders point type options and forwards changes", () => {
    const onChange = vi.fn();

    render(<DialogPointsTypeToggle value={POINTS_TYPE[0].id} onChange={onChange} />);

    expect(screen.getByText(POINTS_TYPE[0].localizationKey)).toBeTruthy();
    expect(screen.getByText(POINTS_TYPE[1].localizationKey)).toBeTruthy();

    fireEvent.click(screen.getByLabelText(POINTS_TYPE[1].localizationKey));

    expect(onChange).toHaveBeenCalledWith(POINTS_TYPE[1].id);
  });
});
