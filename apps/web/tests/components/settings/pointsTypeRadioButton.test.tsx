import { POINTS_TYPE } from "@belot/constants";

import { PointsTypeRadioButton } from "@/components/settings/pointsTypeRadioButton";

import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithTooltip } from "../../testUtils";

vi.mock("@belot/localizations", () => ({
  formatLocalizationKey: (localizationKey: string) =>
    localizationKey
      .split(".")
      .map((keyPart, index) =>
        index === 0 ? keyPart : keyPart.at(0)?.toUpperCase() + keyPart.substring(1),
      )
      .join(""),
  useLocalizations: () => ({
    settingsPointsType: "Points type",
    settingsPointsTypeHint: "Hint",
    settingsPointsTypeMicropoints: "Micropoints",
    settingsPointsTypePoints: "Points",
  }),
}));

describe("PointsTypeRadioButton", () => {
  it("renders options and calls onChange", () => {
    const onChange = vi.fn();

    renderWithTooltip(<PointsTypeRadioButton value={POINTS_TYPE[0].id} onChange={onChange} />);

    expect(screen.getByText("Points type")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Points"));

    expect(onChange).toHaveBeenCalledWith({ pointsType: POINTS_TYPE[1].id });
  });
});
