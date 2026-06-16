// @vitest-environment jsdom
import PlayersNamesInput from "@/components/players-selection/playersNamesInput";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const handlePlayerNameChange = vi.fn();

vi.mock("@belot/hooks", () => ({
  useHandlePlayersNames: () => ({
    isInvalid: false,
    handlePlayerNameChange,
  }),
}));

vi.mock("@belot/localizations", () => ({
  useLocalization: (key: string, args?: unknown[]) => {
    const value = args?.[0];
    const label = typeof value === "string" || typeof value === "number" ? String(value) : "";
    return `${key}:${label}`;
  },
}));

vi.mock("@/components/players-selection/inputErrors", () => ({
  EmptyNameError: () => null,
  RepeatingNamesError: () => null,
}));

describe("PlayersNamesInput", () => {
  it("clears the player name when the clear icon is clicked", () => {
    const { container } = render(<PlayersNamesInput player={{ id: 0, name: "Alice" }} />);

    fireEvent.click(container.querySelector(".cursor-pointer")!);

    expect(handlePlayerNameChange).toHaveBeenCalledWith("");
  });
});
