// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SettingsPage from "@/pages/settings";

const setSettings = vi.fn();
const getSettingsFromLocalStorage = vi.fn();

vi.mock("@belot/hooks", () => ({
  useSettings: ({ getFromStorage, setToStorage }: {
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
  it("loads settings and renders page content", () => {
    render(<SettingsPage />);

    expect(getSettingsFromLocalStorage).toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Settings" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "points" })).toBeTruthy();
  });
});
