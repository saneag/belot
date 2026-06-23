import { Dispatch, SetStateAction, useMemo } from "react";

import { useGameStore } from "@belot/store";
import { GameMode, Player, RoundScore } from "@belot/types";
import { getOpponentPlayersScore, getOpponentTeamScore } from "@belot/utils/src";

import PlayerScoreInput from "./playerScoreInput";

interface PlayerScoreInputWrapperProps {
  roundScore: RoundScore;
  setRoundScore: Dispatch<SetStateAction<RoundScore>>;
  roundPlayer: Player | null;
  pointsType: string;
}

export default function PlayerScoreInputWrapper({
  roundScore,
  setRoundScore,
  roundPlayer,
  pointsType,
}: PlayerScoreInputWrapperProps) {
  const players = useGameStore((state) => state.players);
  const teams = useGameStore((state) => state.teams);
  const gameMode = useGameStore((state) => state.mode);

  const opponents = useMemo(
    () =>
      gameMode === GameMode.classic
        ? getOpponentPlayersScore(roundPlayer, roundScore.playersScores)
        : getOpponentTeamScore(roundPlayer, roundScore.teamsScores),
    [gameMode, roundPlayer, roundScore.playersScores, roundScore.teamsScores],
  );

  return opponents?.map((opponent) => (
    <PlayerScoreInput
      key={opponent.id}
      opponent={opponent}
      roundScore={roundScore}
      setRoundScore={setRoundScore}
      gameMode={gameMode}
      players={players}
      teams={teams}
      roundPlayer={roundPlayer}
      pointsType={pointsType}
    />
  ));
}
