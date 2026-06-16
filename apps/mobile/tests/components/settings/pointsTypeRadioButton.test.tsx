// @vitest-environment jsdom
import { POINTS_TYPE } from "@belot/constants";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const formatLocalizationKey = (localizationKey: string) =>
  localizationKey
    .split(".")
    .map((keyPart, index) =>
      index === 0 ? keyPart : keyPart.at(0)?.toUpperCase() + keyPart.substring(1),
    )
    .join("");

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => ({
    [formatLocalizationKey("settings.points.type")]: "Points type",
    [formatLocalizationKey("settings.points.type.hint")]: "Hint",
    [formatLocalizationKey("settings.points.type.micropoints")]: "Micropoints",
    [formatLocalizationKey("settings.points.type.points")]: "Points",
  }),
  formatLocalizationKey,
}));

describe("PointsTypeRadioButton", () => {
  it("renders options and handles change", async () => {
    const onChange = vi.fn().mockResolvedValue(undefined);
    const { PointsTypeRadioButton } = await import("@/components/settings/pointsTypeRadioButton");

    render(<PointsTypeRadioButton value={POINTS_TYPE[0].id} onChange={onChange} />);

    expect(screen.getByText("Points type")).toBeTruthy();
    expect(screen.getByText("Hint")).toBeTruthy();
    expect(screen.getByText("Micropoints")).toBeTruthy();
    expect(screen.getByText("Points")).toBeTruthy();

    fireEvent.click(screen.getByText("Points"));
    expect(onChange).toHaveBeenCalledWith({ pointsType: POINTS_TYPE[1].id });
  });
});
