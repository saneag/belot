// @vitest-environment jsdom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@react-navigation/stack", () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="navigator">{children}</div>
    ),
    Screen: ({ name }: { name: string }) => <div data-testid={`screen-${name}`} />,
  }),
}));

vi.mock("@/app/starting-screen", () => ({ default: () => <div>Starting</div> }));
vi.mock("@/app/players-selection", () => ({ default: () => <div>Players</div> }));
vi.mock("@/app/game-table", () => ({ default: () => <div>Game</div> }));
vi.mock("@/app/settings-screen", () => ({ default: () => <div>Settings</div> }));

describe("Navigation", () => {
  it("renders stack navigator with screens", async () => {
    const { default: Navigation } = await import("@/components/navigation");
    const { getByTestId } = render(<Navigation />);

    expect(getByTestId("navigator")).toBeTruthy();
    expect(getByTestId("screen-starting-screen")).toBeTruthy();
    expect(getByTestId("screen-players-selection")).toBeTruthy();
    expect(getByTestId("screen-game-table")).toBeTruthy();
    expect(getByTestId("screen-settings-screen")).toBeTruthy();
  });
});
