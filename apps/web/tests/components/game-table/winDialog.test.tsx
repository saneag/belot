// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import WinDialog from "@/components/game-table/winDialog";

const reset = vi.fn();
const navigateMock = vi.fn();
const storeMocks = vi.hoisted(() => ({
  mode: "classic",
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: { mode: typeof storeMocks.mode; reset: typeof reset }) => unknown) =>
    selector({ mode: storeMocks.mode, reset }),
}));

vi.mock("@belot/localizations", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@belot/localizations")>();
  return {
    ...actual,
    useLocalizations: () => ({
      winDialogTitlePlayer: "Player wins",
      winDialogTitleTeam: "Team wins",
      winDialogContent: "Congratulations",
    }),
  };
});

vi.mock("@/components/confirmationDialog", () => ({
  default: ({
    title,
    content,
    confirmationCallback,
    cancelCallback,
  }: {
    title: React.ReactNode;
    content: React.ReactNode;
    confirmationCallback: () => void;
    cancelCallback: () => void;
  }) => (
    <div>
      <h2>{title}</h2>
      <p>{content}</p>
      <button type="button" onClick={confirmationCallback}>
        Reset
      </button>
      <button type="button" onClick={cancelCallback}>
        Close
      </button>
    </div>
  ),
}));

describe("WinDialog", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows winner dialog and resets game on confirm", () => {
    storeMocks.mode = "classic";

    render(
      <MemoryRouter>
        <WinDialog winner={{ id: 0, name: "Alice" }} setWinner={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Player wins")).toBeTruthy();
    screen.getByRole("button", { name: "Reset" }).click();

    expect(reset).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("uses team title in teams mode and closes dialog", () => {
    storeMocks.mode = "teams";

    render(
      <MemoryRouter>
        <WinDialog winner={{ id: 0, name: "Team A" }} setWinner={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Team wins")).toBeTruthy();
    screen.getByRole("button", { name: "Close" }).click();
  });
});
