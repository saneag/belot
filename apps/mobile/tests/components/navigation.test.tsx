// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("expo-router", () => ({
  withLayoutContext: (Navigator: React.ComponentType<{ children?: React.ReactNode }>) =>
    function JsStack({ children }: { children?: React.ReactNode }) {
      return <Navigator>{children}</Navigator>;
    },
}));

vi.mock("@react-navigation/stack", () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="js-stack">{children}</div>
    ),
  }),
}));

describe("Navigation", () => {
  it("exports a js stack navigator for expo-router", async () => {
    const { JsStack, stackScreenOptions } = await import("@/components/navigation");
    const { getByTestId } = render(<JsStack />);

    expect(getByTestId("js-stack")).toBeTruthy();
    expect(stackScreenOptions.animation).toBe("scale_from_center");
  });
});
