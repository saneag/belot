// @vitest-environment jsdom
import StartingPage from "@/pages/starting-page";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/starting-screen/useStartingScreenActions", () => ({
  useStartingScreenActions: () => [
    { index: 0, label: "New Game", isActive: true, onPress: vi.fn() },
    { index: 1, label: "Settings", isActive: true, onPress: vi.fn() },
  ],
}));

describe("StartingPage", () => {
  it("renders logo and action buttons", () => {
    render(<StartingPage />);

    expect(screen.getByAltText("Belot-score logo")).toBeTruthy();
    expect(screen.getByText("Belot-score")).toBeTruthy();
    expect(screen.getByRole("button", { name: "New Game" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Settings" })).toBeTruthy();
  });
});
