import { GameMode, type Player, type RoundScore } from "@belot/types";

import GameTable from "@/components/game-table";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  roundsScores: [
    { id: 0, playersScores: [], teamsScores: [], totalRoundScore: 0, roundPlayer: null },
  ] as RoundScore[],
  undoneRoundsScores: [] as RoundScore[],
  undoRoundScore: vi.fn(),
  redoRoundScore: vi.fn(),
  players: [{ id: 0, name: "Alice" }],
  teams: [],
  markForReset: vi.fn(),
}));

vi.mock("expo-router", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

vi.mock("@/components/game-table/action-buttons/next-round-button", () => ({
  default: ({ setWinner }: { setWinner: (w: Player) => void }) => (
    <button onClick={() => setWinner({ id: 0, name: "Alice" })}>Trigger Win</button>
  ),
}));

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => ({
    undoRoundTitle: "Undo",
    redoRoundTitle: "Redo",
    skipRoundTitle: "Skip",
    skipRoundContent: "Skip content",
    winDialogTitlePlayer: "Player wins",
    winDialogTitleTeam: "Team wins",
    winDialogContent: "Win content",
  }),
  useLocalization: (key: string) => key,
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      ...mocks,
      mode: GameMode.classic,
      markForReset: mocks.markForReset,
      reset: vi.fn(),
    }),
}));

vi.mock("@belot/hooks", () => ({
  useGameReset: () => ({ handleReset: vi.fn() }),
  useHandleSkipRound: () => vi.fn(),
  useHandleConfirmationDialog: ({
    visible,
    setVisible,
    cancelCallback,
    confirmationCallback,
  }: {
    visible?: boolean;
    setVisible?: (v: boolean) => void;
    cancelCallback?: () => void;
    confirmationCallback?: () => void;
  }) => ({
    isVisible: visible ?? false,
    messages: {
      confirmationDialogConfirmButton: "Confirm",
      confirmationDialogCancelButton: "Cancel",
    },
    showDialog: vi.fn(),
    hideDialog: () => setVisible?.(false),
    handleDialogCancel: () => {
      cancelCallback?.();
      setVisible?.(false);
    },
    handleDialogConfirmation: () => {
      confirmationCallback?.();
      setVisible?.(false);
    },
  }),
  useGetTableHeaderDealerBackground: () => ({ getDealerBackground: () => "" }),
  useEffectivePointsType: () => "micropoints",
}));

vi.mock("@/hooks/game-table/useGetPlayersNamesWithScoreColumn", () => ({
  default: () => ({
    playersNamesWithScoreColumn: ["Alice", "Score"],
    columnsCount: 1,
  }),
}));

describe("GameTable winner branch", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows ResetGameButton when there is a winner", () => {
    render(<GameTable />);
    fireEvent.click(screen.getByText("Trigger Win"));
    expect(screen.getByText("game.reset.submit.button")).toBeTruthy();
  });
});
