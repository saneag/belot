import PlayersSelectionPage from "@/pages/players-selection";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

let isMaxScoreEnabled = false;

vi.mock("@belot/hooks", () => ({
  useFeatureToggle: () => isMaxScoreEnabled,
}));

vi.mock("@belot/components", () => ({
  PlayersSelectionContextProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/backButton", () => ({
  BackButton: () => <button type="button">Back</button>,
}));

vi.mock("@/components/players-selection/playersCount", () => ({
  default: () => <div>Players count</div>,
}));

vi.mock("@/components/players-selection/maxScoreSelector", () => ({
  default: () => <div>Max score</div>,
}));

vi.mock("@/components/players-selection/playersNames", () => ({
  default: () => <div>Players names</div>,
}));

vi.mock("@/components/players-selection/actionButtons", () => ({
  default: () => <button type="button">Submit</button>,
}));

vi.mock("@/components/players-selection/loadPreviousGameButton", () => ({
  default: () => <button type="button">Load previous</button>,
}));

afterEach(cleanup);

describe("PlayersSelectionPage", () => {
  it("renders players selection sections without max score selector when toggle is off", () => {
    isMaxScoreEnabled = false;
    render(<PlayersSelectionPage />);

    expect(screen.getByText("Back")).toBeTruthy();
    expect(screen.getByText("Players count")).toBeTruthy();
    expect(screen.queryByText("Max score")).toBeNull();
    expect(screen.getByText("Players names")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Submit" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Load previous" })).toBeTruthy();
  });

  it("renders max score selector when toggle is on", () => {
    isMaxScoreEnabled = true;
    render(<PlayersSelectionPage />);

    expect(screen.getByText("Max score")).toBeTruthy();
  });
});
