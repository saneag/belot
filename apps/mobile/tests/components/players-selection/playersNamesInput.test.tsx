// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const handlePlayerNameChange = vi.fn();

vi.mock("@belot/hooks", () => ({
  useHandlePlayersNames: () => ({
    isInvalid: false,
    handlePlayerNameChange,
  }),
}));

vi.mock("@belot/localizations", () => ({
  useLocalization: (key: string, args?: number[]) => (args ? `${key}:${args[0]}` : key),
}));

vi.mock("@/components/players-selection/inputErrors", () => ({
  EmptyNameError: () => <span>empty-error</span>,
  RepeatingNamesError: () => <span>repeat-error</span>,
}));

describe("PlayersNamesInput", () => {
  it("renders input and handles change", async () => {
    const { default: PlayersNamesInput } =
      await import("@/components/players-selection/playersNamesInput");

    render(<PlayersNamesInput player={{ id: 0, name: "Alice" }} />);

    expect(screen.getByText("players.names.input.label:1")).toBeTruthy();
    fireEvent.change(screen.getByDisplayValue("Alice"), { target: { value: "Ann" } });
    expect(handlePlayerNameChange).toHaveBeenCalledWith("Ann");
  });
});
