import { type Dispatch, type SetStateAction, useCallback, useEffect, useMemo, useRef } from "react";

import { formatLocalizationString, useLocalizations } from "@belot/localizations";
import {
  GameMode,
  type Player,
  type PlayerScore,
  type RoundScore,
  type Team,
  type TeamScore,
} from "@belot/types";
import { handleRoundScoreChange, prepareRoundScoresBasedOnGameMode, getScoreInputMaxLength } from "@belot/utils/src";

import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

interface PlayerScoreInputProps {
  opponent: PlayerScore | TeamScore;
  roundScore: RoundScore;
  setRoundScore: Dispatch<SetStateAction<RoundScore>>;
  gameMode: GameMode;
  players: Player[];
  teams: Team[];
  roundPlayer: Player | null;
  pointsType: string;
}

export default function PlayerScoreInput({
  opponent,
  roundScore,
  setRoundScore,
  gameMode,
  players,
  teams,
  roundPlayer,
  pointsType,
}: PlayerScoreInputProps) {
  const messages = useLocalizations([{ key: "next.round.score.for.player" }]);

  const finalRoundScore = useMemo(
    () => prepareRoundScoresBasedOnGameMode(gameMode, roundScore, opponent),
    [gameMode, opponent, roundScore],
  );

  const inputLabel = useMemo(() => {
    if ("playerId" in opponent) {
      const player = players.find((player) => player.id === opponent.playerId);
      return formatLocalizationString(messages.nextRoundScoreForPlayer, [player?.name]);
    }

    const team = teams.find((team) => team.id === opponent.teamId);
    return formatLocalizationString(messages.nextRoundScoreForPlayer, [team?.name]);
  }, [messages.nextRoundScoreForPlayer, opponent, players, teams]);

  const handleInputChange = useCallback(
    (value: number) => {
      setRoundScore((prev) =>
        handleRoundScoreChange({
          opponent,
          prevRoundScore: prev,
          gameMode,
          newScoreValue: value,
          roundPlayer,
        }),
      );
    },
    [gameMode, opponent, roundPlayer, setRoundScore],
  );

  const lastSyncedScoreRef = useRef<{
    opponentId: number;
    totalRoundScore: number;
    score: number;
  } | null>(null);

  useEffect(() => {
    if (!roundScore.totalRoundScore) {
      lastSyncedScoreRef.current = null;
      return;
    }

    const targetScore = finalRoundScore?.score ?? 0;
    const lastSyncedScore = lastSyncedScoreRef.current;

    if (
      lastSyncedScore?.opponentId === opponent.id &&
      lastSyncedScore.totalRoundScore === roundScore.totalRoundScore &&
      lastSyncedScore.score === targetScore
    ) {
      return;
    }

    handleInputChange(targetScore);
    lastSyncedScoreRef.current = {
      opponentId: opponent.id,
      totalRoundScore: roundScore.totalRoundScore,
      score: targetScore,
    };
  }, [finalRoundScore?.score, handleInputChange, opponent.id, roundScore.totalRoundScore]);

  return (
    <Field>
      <FieldLabel htmlFor={`${opponent.id}`}>{inputLabel}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={`${opponent.id}`}
          className="[-moz-appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          value={String(finalRoundScore?.score || 0)}
          maxLength={getScoreInputMaxLength(pointsType)}
          type="number"
          onChange={(e) => handleInputChange(Number(e.target.value))}
          onFocus={(e) => {
            const inputElement = e.target;
            inputElement.select();
          }}
        />
      </InputGroup>
    </Field>
  );
}
