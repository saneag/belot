// @vitest-environment jsdom

import type { Player, RoundScore } from "@belot/types";
import { GameMode } from "@belot/types";

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import RoundPlayerSelect from "@/components/game-table/action-buttons/next-round-button/roundPlayerSelect";
import RoundScoreSelect from "@/components/game-table/action-buttons/next-round-button/roundScoreSelect";
import ScoreDialogContent from "@/components/game-table/action-buttons/next-round-button/scoreDialogContent";
import PlayerScoreInputWrapper from "@/components/game-table/action-buttons/next-round-button/playerScoreInputWrapper";

const mocks = vi.hoisted(() => ({
  players: [
    { id: 0, name: "Alice" },
    { id: 1, name: "Bob" },
  ] as { id: number; name: string }[],
  teams: [
    { id: 0, name: "Team A" },
    { id: 1, name: "Team B" },
  ],
  roundsScores: [] as RoundScore[],
  gameMode: "classic" as "classic" | "teams",
}));

vi.mock("@belot/localizations", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@belot/localizations")>();

  return {
    ...actual,
    useLocalization: (key: string, args?: string[]) =>
      args ? `${key}:${args.join(",")}` : key,
    useLocalizations: () => ({
      nextRoundScoreForPlayer: "Score for {0}",
      settingsPointsTypeMicropoints: "Micropoints",
      settingsPointsTypePoints: "Points",
    }),
    formatLocalizationString: (msg: string, args: string[]) => `${msg}:${args[0]}`,
  };
});

vi.mock("@belot/store", () => ({
  useGameStore: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      players: mocks.players,
      teams: mocks.teams,
      mode: mocks.gameMode,
      roundsScores: mocks.roundsScores,
    }),
}));

describe("next-round-button components", () => {
  beforeEach(() => {
    mocks.gameMode = "classic";
    mocks.players = [
      { id: 0, name: "Alice" },
      { id: 1, name: "Bob" },
    ];
    mocks.roundsScores = [
      {
        id: 0,
        playersScores: [
          { id: 0, playerId: 0, score: 0, boltCount: 0, totalScore: 0 },
          { id: 1, playerId: 1, score: 0, boltCount: 0, totalScore: 0 },
        ],
        teamsScores: [],
        totalRoundScore: 0,
        roundPlayer: null,
      },
    ];
  });

  it("RoundPlayerSelect selects a player", () => {
    const setRoundPlayer = vi.fn();

    render(<RoundPlayerSelect setRoundPlayer={setRoundPlayer} />);
    fireEvent.click(screen.getByText("Alice"));
    expect(setRoundPlayer).toHaveBeenCalledWith(mocks.players[0]);
  });

  it("RoundPlayerDisplay shows player and allows edit", async () => {
    const setRoundPlayer = vi.fn();
    vi.resetModules();
    const { default: RoundPlayerDisplay } = await import(
      "@/components/game-table/action-buttons/next-round-button/roundPlayerDisplay"
    );

    const { container } = render(
      <RoundPlayerDisplay roundPlayer={mocks.players[0]} setRoundPlayer={setRoundPlayer} />,
    );
    expect(screen.getByText("next.round.player.display:Alice")).toBeTruthy();
    fireEvent.click(container.querySelector("button")!);
    expect(setRoundPlayer).toHaveBeenCalledWith(null);
  });

  it("RoundScoreSelect updates round score", () => {
    const setRoundScore = vi.fn();
    const roundScore: RoundScore = {
      id: 0,
      playersScores: [],
      teamsScores: [],
      totalRoundScore: 0,
      roundPlayer: null,
    };

    render(
      <RoundScoreSelect
        roundScore={roundScore}
        setRoundScore={setRoundScore}
        pointsType="micropoints"
      />,
    );
    fireEvent.click(screen.getByText("+ 2"));
    expect(setRoundScore).toHaveBeenCalled();

    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("- 2"));
    expect(setRoundScore).toHaveBeenCalled();
  });

  it("ScoreDialogContent shows player select when no round player", () => {
    render(
      <ScoreDialogContent
        roundPlayer={null}
        setRoundPlayer={vi.fn()}
        roundScore={{
          id: 0,
          playersScores: [],
          teamsScores: [],
          totalRoundScore: 0,
          roundPlayer: null,
        }}
        setRoundScore={vi.fn()}
        dialogPointsType="micropoints"
        onDialogPointsTypeChange={vi.fn()}
        isPointsTypeEnabled={false}
      />,
    );

    expect(screen.getAllByText("next.round.player.select")[0]).toBeTruthy();
  });

  it("ScoreDialogContent shows score inputs when round player selected", () => {
    render(
      <ScoreDialogContent
        roundPlayer={mocks.players[0]}
        setRoundPlayer={vi.fn()}
        roundScore={{
          id: 0,
          playersScores: [],
          teamsScores: [],
          totalRoundScore: 162,
          roundPlayer: mocks.players[0],
        }}
        setRoundScore={vi.fn()}
        dialogPointsType="micropoints"
        onDialogPointsTypeChange={vi.fn()}
        isPointsTypeEnabled={false}
      />,
    );

    expect(screen.getByText("next.round.score:16")).toBeTruthy();
    expect(screen.getByText("Score for {0}:Bob")).toBeTruthy();
  });

  it("PlayerScoreInputWrapper renders opponent inputs", () => {
    render(
      <PlayerScoreInputWrapper
        roundPlayer={mocks.players[0]}
        roundScore={{
          id: 0,
          playersScores: [],
          teamsScores: [],
          totalRoundScore: 162,
          roundPlayer: mocks.players[0],
        }}
        setRoundScore={vi.fn()}
        pointsType="micropoints"
      />,
    );

    expect(document.querySelectorAll("input").length).toBeGreaterThan(0);
  });
});
