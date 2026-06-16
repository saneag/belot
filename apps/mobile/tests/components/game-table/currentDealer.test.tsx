// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  dealer: { id: 0, name: "Alice" } as { id: number; name: string } | null,
}));

vi.mock("@belot/localizations", () => ({
  useLocalization: (_key: string, args?: string[]) => `Dealer: ${args?.[0] ?? ""}`,
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: { dealer: typeof mocks.dealer }) => unknown) =>
    selector({ dealer: mocks.dealer }),
}));

describe("CurrentDealer", () => {
  beforeEach(() => {
    mocks.dealer = { id: 0, name: "Alice" };
  });

  it("renders dealer message", async () => {
    const { default: CurrentDealer } = await import("@/components/game-table/currentDealer");
    render(<CurrentDealer />);
    expect(screen.getByText("Dealer: Alice")).toBeTruthy();
  });
});
