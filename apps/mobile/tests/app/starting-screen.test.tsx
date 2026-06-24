import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  pendingReset: false,
  reset: vi.fn(),
  transitionCallback: null as null | (() => void),
}));

vi.mock("expo-router", () => ({
  useNavigation: () => ({
    addListener: vi.fn((_event: string, callback: () => void) => {
      mocks.transitionCallback = callback;
      return vi.fn();
    }),
  }),
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: { pendingReset: boolean; reset: () => void }) => unknown) =>
    selector({ pendingReset: mocks.pendingReset, reset: mocks.reset }),
}));

vi.mock("@/hooks/starting-screen/useStartingScreenActions", () => ({
  useStartingScreenActions: () => [
    { index: 0, label: "New game", isActive: true, onPress: vi.fn() },
    { index: 1, label: "Settings", isActive: true, onPress: vi.fn() },
  ],
}));

describe("StartingScreen", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
    mocks.pendingReset = false;
    mocks.transitionCallback = null;
  });

  it("renders title and action buttons", async () => {
    const { default: StartingScreen } = await import("@/app/starting-screen");
    render(<StartingScreen />);

    expect(screen.getByText("Belot-score")).toBeTruthy();
    expect(screen.getByText("New game")).toBeTruthy();
    expect(screen.getByText("Settings")).toBeTruthy();
  });

  it("opens dev tools from the hidden brand long press", async () => {
    const { fireEvent } = await import("@testing-library/react");
    const { default: StartingScreen } = await import("@/app/starting-screen");
    render(<StartingScreen />);

    fireEvent.doubleClick(screen.getByText("Belot-score"));

    expect(mocks.push).toHaveBeenCalledWith("/dev-tools");
  });

  it("does not reset after transition when reset is not pending", async () => {
    const { default: StartingScreen } = await import("@/app/starting-screen");
    render(<StartingScreen />);
    mocks.transitionCallback?.();
    expect(mocks.reset).not.toHaveBeenCalled();
  });

  it("resets after transition when reset is pending", async () => {
    mocks.pendingReset = true;
    const { default: StartingScreen } = await import("@/app/starting-screen");

    render(<StartingScreen />);
    mocks.transitionCallback?.();

    expect(mocks.reset).toHaveBeenCalled();
  });
});
