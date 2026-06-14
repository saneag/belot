// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  settings: { pointsType: "points" },
  setSettings: vi.fn(),
  getSettingsFromLocalStorage: vi.fn(),
}));

vi.mock("@belot/hooks", () => ({
  useSettings: () => ({
    settings: mocks.settings,
    setSettings: mocks.setSettings,
    getSettingsFromLocalStorage: mocks.getSettingsFromLocalStorage,
  }),
}));

vi.mock("@belot/localizations", () => ({
  useLocalization: () => "Settings",
}));

vi.mock("@/components/backButton", () => ({
  BackButton: () => <div>Back</div>,
}));

vi.mock("@/components/pageHeader", () => ({
  PageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("@/components/settings/pointsTypeRadioButton", () => ({
  PointsTypeRadioButton: () => <div>PointsType</div>,
}));

describe("SettingsScreen", () => {
  it("renders settings screen", async () => {
    const { default: SettingsScreen } = await import("@/app/settings-screen");
    render(<SettingsScreen />);

    expect(screen.getByText("Back")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Settings" })).toBeTruthy();
    expect(screen.getByText("PointsType")).toBeTruthy();
    expect(mocks.getSettingsFromLocalStorage).toHaveBeenCalled();
  });
});
