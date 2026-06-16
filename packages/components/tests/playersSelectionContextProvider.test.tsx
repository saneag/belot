// @vitest-environment jsdom
import { usePlayersSelectionContext } from "@belot/hooks";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PlayersSelectionContextProvider } from "../src/playersSelectionContextProvider";

vi.mock("@belot/hooks", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@belot/hooks")>();

  return {
    ...actual,
    useValidations: () => ({
      validations: { emptyNames: [], repeatingNames: [] },
      setValidations: vi.fn(),
      resetValidations: vi.fn(),
    }),
  };
});

function ValidationReader() {
  const { validations } = usePlayersSelectionContext();
  return <span>{validations.emptyNames.length}</span>;
}

describe("PlayersSelectionContextProvider", () => {
  it("provides validation state to descendants", () => {
    render(
      <PlayersSelectionContextProvider>
        <ValidationReader />
      </PlayersSelectionContextProvider>,
    );

    expect(screen.getByText("0")).toBeTruthy();
  });
});
