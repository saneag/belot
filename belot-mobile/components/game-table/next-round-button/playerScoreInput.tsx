import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import {
  handleRoundScoreChange,
  prepareRoundScoresBasedOnGameMode,
  GameMode,
  Player,
  PlayerScore,
  RoundScore,
  Team,
  TeamScore,
} from '@belot/shared';
import {
  formatLocalizationString,
  useLocalizations,
} from '@/localizations/useLocalization';

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
  const messages = useLocalizations([
    { key: 'next.round.score.for.player' },
    { key: 'next.round.score.for.player.input.helper' },
  ]);

  const finalRoundScore = useMemo(
    () => prepareRoundScoresBasedOnGameMode(gameMode, roundScore, opponent),
    [gameMode, opponent, roundScore]
  );

  const inputLabel = useMemo(() => {
    if ('playerId' in opponent) {
      const player = players.find((player) => player.id === opponent.playerId);
      return formatLocalizationString(messages.nextRoundScoreForPlayer, [
        player?.name,
      ]);
    }

    const team = teams.find((team) => team.id === opponent.teamId);
    return formatLocalizationString(messages.nextRoundScoreForPlayer, [
      team?.name,
    ]);
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
        })
      );
    },
    [gameMode, opponent, roundPlayer, setRoundScore]
  );

  useEffect(() => {
    if (roundScore.totalRoundScore) {
      handleInputChange(finalRoundScore?.score || 0);
    }
  }, [finalRoundScore?.score, handleInputChange, roundScore.totalRoundScore]);

  return (
    <View>
      <TextInput
        label={inputLabel}
        mode="outlined"
        maxLength={3}
        keyboardType="number-pad"
        style={{ minHeight: 60 }}
        value={String(finalRoundScore?.score || 0)}
        onChangeText={(value) => handleInputChange(Number(value))}
        selectTextOnFocus
      />
      <HelperText type="info">
        {messages.nextRoundScoreForPlayerInputHelper}
      </HelperText>
    </View>
  );
}
