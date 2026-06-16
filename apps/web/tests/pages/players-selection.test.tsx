// @vitest-environment jsdom
import PlayersSelectionPage from "@/pages/players-selection";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

vi.mock("@/components/players-selection/playersNames", () => ({
  default: () => <div>Players names</div>,
}));

vi.mock("@/components/players-selection/actionButtons", () => ({
  default: () => <button type="button">Submit</button>,
}));

vi.mock("@/components/players-selection/loadPreviousGameButton", () => ({
  default: () => <button type="button">Load previous</button>,
}));

describe("PlayersSelectionPage", () => {
  it("renders players selection sections", () => {
    render(<PlayersSelectionPage />);

    expect(screen.getByText("Back")).toBeTruthy();
    expect(screen.getByText("Players count")).toBeTruthy();
    expect(screen.getByText("Players names")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Submit" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Load previous" })).toBeTruthy();
  });
});
