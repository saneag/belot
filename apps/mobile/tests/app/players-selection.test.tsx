import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/backButton", () => ({
  BackButton: () => <div>Back</div>,
}));

vi.mock("@/components/dismissKeyboardView", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/players-selection/playersCount", () => ({
  default: () => <div>PlayersCount</div>,
}));

vi.mock("@/components/players-selection/playersNames", () => ({
  default: () => <div>PlayersNames</div>,
}));

vi.mock("@/components/players-selection/actionButtons", () => ({
  default: () => <div>ActionButtons</div>,
}));

vi.mock("@/components/players-selection/loadPreviousGameButton", () => ({
  default: () => <div>LoadPrevious</div>,
}));

vi.mock("@belot/components", () => ({
  PlayersSelectionContextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const featureMocks = vi.hoisted(() => ({
  maxScoreEnabled: false,
}));

vi.mock("@belot/hooks", () => ({
  useFeatureToggle: () => featureMocks.maxScoreEnabled,
}));

vi.mock("@/components/players-selection/maxScoreSelector", () => ({
  default: () => <div>MaxScoreSelector</div>,
}));

describe("PlayersSelectionScreen", () => {
  it("renders players selection layout", async () => {
    const { default: PlayersSelectionScreen } = await import("@/app/players-selection");
    render(<PlayersSelectionScreen />);

    expect(screen.getByText("Back")).toBeTruthy();
    expect(screen.getByText("PlayersCount")).toBeTruthy();
    expect(screen.getByText("PlayersNames")).toBeTruthy();
    expect(screen.getByText("ActionButtons")).toBeTruthy();
    expect(screen.getByText("LoadPrevious")).toBeTruthy();
  });

  it("renders max score selector when enabled", async () => {
    featureMocks.maxScoreEnabled = true;
    const { default: PlayersSelectionScreen } = await import("@/app/players-selection");

    render(<PlayersSelectionScreen />);

    expect(screen.getByText("MaxScoreSelector")).toBeTruthy();
  });
});
