import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("expo-router", () => ({
  useNavigation: () => ({ addListener: vi.fn(() => vi.fn()) }),
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: { pendingReset: boolean; reset: () => void }) => unknown) =>
    selector({ pendingReset: false, reset: vi.fn() }),
}));

vi.mock("@/hooks/starting-screen/useStartingScreenActions", () => ({
  useStartingScreenActions: () => [
    { index: 0, label: "New game", isActive: true, onPress: vi.fn() },
    { index: 1, label: "Settings", isActive: true, onPress: vi.fn() },
  ],
}));

describe("StartingScreen", () => {
  it("renders title and action buttons", async () => {
    const { default: StartingScreen } = await import("@/app/starting-screen");
    render(<StartingScreen />);

    expect(screen.getByText("Belot-score")).toBeTruthy();
    expect(screen.getByText("New game")).toBeTruthy();
    expect(screen.getByText("Settings")).toBeTruthy();
  });
});
