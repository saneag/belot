// @vitest-environment jsdom
import { useState } from "react";

import { type Player, type RoundScore } from "@belot/types";

import ScoreDialogContent from "@/components/game-table/action-buttons/next-round-button/scoreDialogContent";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/game-table/action-buttons/next-round-button/roundPlayerSelect", () => ({
  default: () => <div>Select player</div>,
}));

vi.mock("@/components/game-table/action-buttons/next-round-button/roundPlayerDisplay", () => ({
  default: () => <div>Selected player</div>,
}));

vi.mock("@/components/game-table/action-buttons/next-round-button/dialogPointsTypeToggle", () => ({
  default: () => <div>Points type toggle</div>,
}));

vi.mock("@/components/game-table/action-buttons/next-round-button/roundScoreSelect", () => ({
  default: () => <div>Score select</div>,
}));

vi.mock("@/components/game-table/action-buttons/next-round-button/playerScoreInputWrapper", () => ({
  default: () => <div>Score inputs</div>,
}));

describe("ScoreDialogContent", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders player select when no round player is chosen", () => {
    const setRoundPlayer = vi.fn();
    const setRoundScore = vi.fn();

    render(
      <ScoreDialogContent
        roundPlayer={null}
        setRoundPlayer={setRoundPlayer}
        roundScore={{ id: 0, playersScores: [], teamsScores: [], totalRoundScore: 0 }}
        setRoundScore={setRoundScore}
        dialogPointsType="micropoints"
        onDialogPointsTypeChange={vi.fn()}
        isPointsTypeEnabled={false}
      />,
    );

    expect(screen.getByText("Select player")).toBeTruthy();
  });

  it("renders score inputs when round player is chosen", () => {
    function Harness({ isPointsTypeEnabled }: { isPointsTypeEnabled: boolean }) {
      const [roundPlayer, setRoundPlayer] = useState<Player | null>({ id: 0, name: "Alice" });
      const [roundScore, setRoundScore] = useState<RoundScore>({
        id: 0,
        playersScores: [],
        teamsScores: [],
        totalRoundScore: 0,
      });

      return (
        <ScoreDialogContent
          roundPlayer={roundPlayer}
          setRoundPlayer={setRoundPlayer}
          roundScore={roundScore}
          setRoundScore={setRoundScore}
          dialogPointsType="micropoints"
          onDialogPointsTypeChange={vi.fn()}
          isPointsTypeEnabled={isPointsTypeEnabled}
        />
      );
    }

    render(<Harness isPointsTypeEnabled={true} />);

    expect(screen.getByText("Selected player")).toBeTruthy();
    expect(screen.getByText("Points type toggle")).toBeTruthy();
    expect(screen.getByText("Score select")).toBeTruthy();
    expect(screen.getByText("Score inputs")).toBeTruthy();
  });

  it("hides points type toggle when feature is disabled", () => {
    render(
      <ScoreDialogContent
        roundPlayer={{ id: 0, name: "Alice" }}
        setRoundPlayer={vi.fn()}
        roundScore={{ id: 0, playersScores: [], teamsScores: [], totalRoundScore: 0 }}
        setRoundScore={vi.fn()}
        dialogPointsType="micropoints"
        onDialogPointsTypeChange={vi.fn()}
        isPointsTypeEnabled={false}
      />,
    );

    expect(screen.queryByText("Points type toggle")).toBeNull();
    expect(screen.getByText("Score select")).toBeTruthy();
  });
});
