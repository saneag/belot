import { Dispatch, SetStateAction, useCallback, useMemo } from "react";

import { useSyncPlayerScoreInput } from "@belot/hooks";
import { formatLocalizationString, useLocalizations } from "@belot/localizations";
import { GameMode, Player, PlayerScore, RoundScore, Team, TeamScore } from "@belot/types";
import { handleRoundScoreChange, prepareRoundScoresBasedOnGameMode, getScoreInputMaxLength } from "@belot/utils/src";

import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

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

  useSyncPlayerScoreInput({
    opponentId: opponent.id,
    totalRoundScore: roundScore.totalRoundScore,
    targetScore: finalRoundScore?.score ?? 0,
    onScoreChange: handleInputChange,
  });

  return (
    <VStack space="xs">
      <Text className="text-sm text-typography-500">{inputLabel}</Text>
      <Input variant="rounded" className="w-full">
        <InputField
          value={String(finalRoundScore?.score || 0)}
          maxLength={getScoreInputMaxLength(pointsType)}
          keyboardType="number-pad"
          onChangeText={(value) => handleInputChange(Number(value))}
          selectTextOnFocus
        />
      </Input>
    </VStack>
  );
}
