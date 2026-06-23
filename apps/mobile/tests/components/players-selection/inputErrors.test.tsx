import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  validations: { 0: { empty: true, repeating: false } },
}));

vi.mock("@belot/hooks", () => ({
  usePlayersSelectionContext: () => ({ validations: mocks.validations }),
}));

vi.mock("@belot/localizations", () => ({
  useLocalization: (key: string) => key,
}));

vi.mock("@belot/utils", () => ({
  isPlayerNameValid: () => false,
  isPlayersNamesEmpty: (_v: unknown, id: number) => id === 0,
  isPlayersNamesRepeating: (_v: unknown, id: number) => id === 1,
}));

describe("inputErrors", () => {
  it("renders empty name error", async () => {
    const { EmptyNameError } = await import("@/components/players-selection/inputErrors");
    render(<EmptyNameError player={{ id: 0, name: "" }} />);
    expect(screen.getByText("players.names.input.empty.error")).toBeTruthy();
  });

  it("renders repeating names error", async () => {
    const { RepeatingNamesError } = await import("@/components/players-selection/inputErrors");
    render(<RepeatingNamesError player={{ id: 1, name: "Alice" }} />);
    expect(screen.getByText("players.names.input.duplicated.name.error")).toBeTruthy();
  });
});
