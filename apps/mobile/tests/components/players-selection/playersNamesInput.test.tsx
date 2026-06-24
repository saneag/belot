import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

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
  afterEach(() => {
    cleanup();
  });

  it("renders input and handles change", async () => {
    const { default: PlayersNamesInput } =
      await import("@/components/players-selection/playersNamesInput");

    render(<PlayersNamesInput player={{ id: 0, name: "Alice" }} />);

    expect(screen.getByText("players.names.input.label:1")).toBeTruthy();
    fireEvent.change(screen.getByDisplayValue("Alice"), { target: { value: "Ann" } });
    expect(handlePlayerNameChange).toHaveBeenCalledWith("Ann");
  });

  it("renders without close icon when name is empty", async () => {
    const { default: PlayersNamesInput } =
      await import("@/components/players-selection/playersNamesInput");

    render(<PlayersNamesInput player={{ id: 0, name: "" }} />);

    fireEvent.click(screen.getByTestId("input-slot"));
    expect(handlePlayerNameChange).toHaveBeenCalledWith("");
  });

  it("clears the player name", async () => {
    const { default: PlayersNamesInput } =
      await import("@/components/players-selection/playersNamesInput");

    render(<PlayersNamesInput player={{ id: 0, name: "Alice" }} />);

    fireEvent.click(screen.getByTestId("input-slot"));

    expect(handlePlayerNameChange).toHaveBeenCalledWith("");
  });
});
