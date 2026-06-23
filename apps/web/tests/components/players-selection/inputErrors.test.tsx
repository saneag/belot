import { EmptyNameError, RepeatingNamesError } from "@/components/players-selection/inputErrors";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@belot/hooks", () => ({
  usePlayersSelectionContext: () => ({
    validations: {
      emptyNames: [0],
      repeatingNames: [1],
    },
  }),
}));

vi.mock("@belot/localizations", () => ({
  useLocalization: (key: string) => key,
}));

vi.mock("@belot/utils/src", () => ({
  isPlayerNameValid: (
    validations: { emptyNames: number[]; repeatingNames: number[] },
    id: number,
  ) => !validations.emptyNames.includes(id) && !validations.repeatingNames.includes(id),
  isPlayersNamesEmpty: (validations: { emptyNames: number[] }, id: number) =>
    validations.emptyNames.includes(id),
  isPlayersNamesRepeating: (validations: { repeatingNames: number[] }, id: number) =>
    validations.repeatingNames.includes(id),
}));

describe("InputErrors", () => {
  it("renders empty name error for invalid empty player", () => {
    render(<EmptyNameError player={{ id: 0, name: "" }} />);

    expect(screen.getByText("players.names.input.empty.error")).toBeTruthy();
  });

  it("renders repeating name error for duplicated player", () => {
    render(<RepeatingNamesError player={{ id: 1, name: "Bob" }} />);

    expect(screen.getByText("players.names.input.duplicated.name.error")).toBeTruthy();
  });

  it("renders nothing when player is valid", () => {
    const { container } = render(<EmptyNameError player={{ id: 2, name: "Charlie" }} />);

    expect(container.textContent).toBe("");
  });
});
