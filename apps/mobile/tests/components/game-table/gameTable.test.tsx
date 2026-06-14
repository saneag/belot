// @vitest-environment jsdom

import { GameMode, type RoundScore } from "@belot/types";

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import GameTable from "@/components/game-table";
import TableBodyWrapper from "@/components/game-table/tableBodyWrapper";
import TableHeaderWrapper from "@/components/game-table/tableHeaderWrapper";

const mocks = vi.hoisted(() => ({
  roundsScores: [
    {
      id: 0,
      playersScores: [],
      teamsScores: [],
      totalRoundScore: 0,
      roundPlayer: null,
    },
  ] as RoundScore[],
  undoneRoundsScores: [] as RoundScore[],
  undoRoundScore: vi.fn(),
  redoRoundScore: vi.fn(),
  reset: vi.fn(),
  players: [
    { id: 0, name: "A" },
    { id: 1, name: "B" },
  ],
  teams: [] as { id: number; name: string; playersIds: number[] }[],
}));

vi.mock("@belot/localizations", () => ({
  useLocalizations: () => ({
    undoRoundTitle: "Undo",
    redoRoundTitle: "Redo",
    skipRoundTitle: "Skip",
    skipRoundContent: "Skip content",
    nextRoundTitle: "Next",
    nextRoundButton: "Next btn",
    gameResetSubmitButton: "Reset",
    winDialogTitlePlayer: "Player wins",
    winDialogTitleTeam: "Team wins",
    winDialogContent: "Win content",
  }),
  useLocalization: (key: string) => key,
}));

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: typeof mocks & { mode: GameMode; reset: () => void }) => unknown) =>
    selector({
      ...mocks,
      mode: GameMode.classic,
      reset: mocks.reset,
    }),
}));

vi.mock("@belot/hooks", () => ({
  useHandleSkipRound: () => vi.fn(),
  useHandleNextRound: () => ({
    handleNextRound: vi.fn(),
    handleCancel: vi.fn(),
    handleDialogOpen: vi.fn(),
    roundPlayer: null,
    roundScore: { id: 0, playersScores: [], teamsScores: [], totalRoundScore: 0, roundPlayer: null },
    setRoundPlayer: vi.fn(),
    setRoundScore: vi.fn(),
  }),
  useHandleConfirmationDialog: ({
    visible,
    setVisible,
    confirmationCallback,
    cancelCallback,
  }: {
    visible?: boolean;
    setVisible?: (v: boolean) => void;
    confirmationCallback?: () => void;
    cancelCallback?: () => void;
  }) => ({
    isVisible: visible ?? false,
    messages: { confirmationDialogConfirmButton: "Confirm", confirmationDialogCancelButton: "Cancel" },
    showDialog: (cb?: () => void) => {
      cb?.();
      setVisible?.(true);
    },
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
  useGetTableHeaderDealerBackground: () => ({
    getDealerBackground: () => "",
  }),
}));

vi.mock("@/hooks/game-table/useGetPlayersNamesWithScoreColumn", () => ({
  default: () => ({
    playersNamesWithScoreColumn: ["A", "B", "Score"],
    columnsCount: 2,
  }),
}));

describe("GameTable components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.roundsScores = [
      {
        id: 0,
        playersScores: [],
        teamsScores: [],
        totalRoundScore: 0,
        roundPlayer: null,
      },
    ];
    mocks.undoneRoundsScores = [];
  });

  it("UndoRoundButton calls undo when enabled", async () => {
    mocks.roundsScores.push({
      id: 1,
      playersScores: [],
      teamsScores: [],
      totalRoundScore: 0,
      roundPlayer: null,
    });

    const { default: UndoRoundButton } = await import(
      "@/components/game-table/action-buttons/undoRound"
    );
    render(<UndoRoundButton />);
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(mocks.undoRoundScore).toHaveBeenCalled();
  });

  it("RedoRoundButton calls redo when enabled", async () => {
    mocks.undoneRoundsScores = [
      {
        id: 1,
        playersScores: [],
        teamsScores: [],
        totalRoundScore: 0,
        roundPlayer: null,
      },
    ];

    vi.resetModules();
    const { default: RedoRoundButton } = await import(
      "@/components/game-table/action-buttons/redoRound"
    );
    render(<RedoRoundButton />);
    fireEvent.click(screen.getAllByRole("button").at(-1)!);
    expect(mocks.redoRoundScore).toHaveBeenCalled();
  });

  it("TableHeaderWrapper renders player names", () => {
    render(<TableHeaderWrapper />);
    expect(screen.getByText("A")).toBeTruthy();
    expect(screen.getByText("Score")).toBeTruthy();
  });

  it("TableBodyWrapper renders completed rounds", () => {
    mocks.roundsScores = [
      {
        id: 0,
        playersScores: [
          { id: 0, playerId: 0, score: 10, boltCount: 0, totalScore: 10 },
          { id: 1, playerId: 1, score: 20, boltCount: 0, totalScore: 20 },
        ],
        teamsScores: [],
        totalRoundScore: 162,
        roundPlayer: null,
      },
      {
        id: 1,
        playersScores: [],
        teamsScores: [],
        totalRoundScore: 0,
        roundPlayer: null,
      },
    ];

    render(<TableBodyWrapper />);
    expect(screen.getByText("10")).toBeTruthy();
  });

  it("GameTable renders action buttons without winner", () => {
    render(<GameTable />);
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });
});
