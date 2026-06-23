import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  settings: { pointsType: "points" },
  setSettings: vi.fn(),
  getSettingsFromLocalStorage: vi.fn(),
  isPointsTypeEnabled: true,
}));

vi.mock("@belot/hooks", () => ({
  useSettings: () => ({
    settings: mocks.settings,
    setSettings: mocks.setSettings,
    getSettingsFromLocalStorage: mocks.getSettingsFromLocalStorage,
  }),
  useIsPointsTypeEnabled: () => mocks.isPointsTypeEnabled,
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
  afterEach(() => {
    cleanup();
  });

  it("renders settings screen", async () => {
    mocks.isPointsTypeEnabled = true;
    const { default: SettingsScreen } = await import("@/app/settings-screen");
    render(<SettingsScreen />);

    expect(screen.getByText("Back")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Settings" })).toBeTruthy();
    expect(screen.getByText("PointsType")).toBeTruthy();
    expect(mocks.getSettingsFromLocalStorage).toHaveBeenCalled();
  });

  it("hides points type settings when feature is disabled", async () => {
    mocks.isPointsTypeEnabled = false;
    const { default: SettingsScreen } = await import("@/app/settings-screen");
    render(<SettingsScreen />);

    expect(screen.queryByText("PointsType")).toBeNull();
  });
});
