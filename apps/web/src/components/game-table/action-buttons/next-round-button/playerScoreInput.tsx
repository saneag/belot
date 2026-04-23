import { type Dispatch, type SetStateAction, useCallback, useEffect, useMemo } from "react";

import {
  GameMode,
  type Player,
  type PlayerScore,
  type RoundScore,
  type Team,
  type TeamScore,
} from "@belot/types";
import { handleRoundScoreChange, prepareRoundScoresBasedOnGameMode } from "@belot/utils/src";

import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

import { formatLocalizationString, useLocalizations } from "@/localizations/useLocalization";

interface PlayerScoreInputProps {
  opponent: PlayerScore | TeamScore;
  roundScore: RoundScore;
  setRoundScore: Dispatch<SetStateAction<RoundScore>>;
  gameMode: GameMode;
  players: Player[];
  teams: Team[];
  roundPlayer: Player | null;
}

export default function PlayerScoreInput({
  opponent,
  roundScore,
  setRoundScore,
  gameMode,
  players,
  teams,
  roundPlayer,
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

  useEffect(() => {
    if (roundScore.totalRoundScore) {
      handleInputChange(finalRoundScore?.score || 0);
    }
  }, [finalRoundScore?.score, handleInputChange, roundScore.totalRoundScore]);

  return (
    <Field>
      <FieldLabel htmlFor={`${opponent.id}`}>{inputLabel}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={`${opponent.id}`}
          className="[-moz-appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          value={String(finalRoundScore?.score || 0)}
          maxLength={3}
          type="number"
          onChange={(e) => handleInputChange(Number(e.target.value))}
          onFocus={(e) => {
            const inputElement = e.target as HTMLInputElement;
            inputElement.select();
          }}
        />
      </InputGroup>
    </Field>
  );
}
