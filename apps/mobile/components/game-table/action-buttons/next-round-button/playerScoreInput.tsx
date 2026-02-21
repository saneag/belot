import { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from "react";

import { GameMode, Player, PlayerScore, RoundScore, Team, TeamScore } from "@belot/types";
import { handleRoundScoreChange, prepareRoundScoresBasedOnGameMode } from "@belot/utils";

import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

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
    <VStack space="xs">
      <Text className="text-sm text-typography-500">{inputLabel}</Text>
      <Input variant="rounded" className="w-full">
        <InputField
          value={String(finalRoundScore?.score || 0)}
          maxLength={3}
          keyboardType="number-pad"
          onChangeText={(value) => handleInputChange(Number(value))}
          selectTextOnFocus
        />
      </Input>
    </VStack>
  );
}
