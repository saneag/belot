// @vitest-environment jsdom
import SettingsPage from "@/pages/settings";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const setSettings = vi.fn();
const getSettingsFromLocalStorage = vi.fn();

const mocks = vi.hoisted(() => ({
  isPointsTypeEnabled: true,
}));

vi.mock("@belot/hooks", () => ({
  useSettings: ({
    getFromStorage,
    setToStorage,
  }: {
    getFromStorage: (key: string) => string | null;
    setToStorage: (key: string, value: string) => void;
  }) => {
    getFromStorage("settings");
    setToStorage("settings", "points");

    return {
      settings: { pointsType: "points" },
      setSettings,
      getSettingsFromLocalStorage,
    };
  },
  useIsPointsTypeEnabled: () => mocks.isPointsTypeEnabled,
}));

vi.mock("@belot/localizations", () => ({
  useLocalization: () => "Settings",
}));

vi.mock("@/components/backButton", () => ({
  BackButton: () => <button type="button">Back</button>,
}));

vi.mock("@/components/pageHeader", () => ({
  PageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("@/components/settings/pointsTypeRadioButton", () => ({
  PointsTypeRadioButton: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (settings: { pointsType: string }) => void;
  }) => (
    <button type="button" onClick={() => void onChange({ pointsType: "micropoints" })}>
      {value}
    </button>
  ),
}));

describe("SettingsPage", () => {
  beforeEach(() => {
    mocks.isPointsTypeEnabled = true;
  });

  afterEach(() => {
    cleanup();
  });

  it("loads settings and renders page content", () => {
    render(<SettingsPage />);

    expect(getSettingsFromLocalStorage).toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Settings" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "points" })).toBeTruthy();
  });

  it("hides points type settings when feature is disabled", () => {
    mocks.isPointsTypeEnabled = false;

    render(<SettingsPage />);

    expect(screen.queryByRole("button", { name: "points" })).toBeNull();
  });
});
