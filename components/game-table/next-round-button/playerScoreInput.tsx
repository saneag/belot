import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { handleRoundScoreChange } from '../../../helpers/gameScoreHelpers';
import {
  GameMode,
  Player,
  PlayerScore,
  RoundScore,
  TeamScore,
} from '../../../types/game';

interface PlayerScoreInputProps {
  opponent: PlayerScore | TeamScore;
  roundScore: RoundScore;
  setRoundScore: Dispatch<SetStateAction<RoundScore>>;
  gameMode: GameMode;
  players: Player[];
}

export default function PlayerScoreInput({
  opponent,
  setRoundScore,
  gameMode,
  players,
}: PlayerScoreInputProps) {
  const inputLabel = useMemo(() => {
    if ('playerId' in opponent) {
      const player = players.find((player) => player.id === opponent.playerId);
      return `Score for ${player?.name}`;
    }

    return `Score for ${opponent.teamId === 0 ? 'N' : 'V'}`;
  }, [opponent, players]);

  const handleInputChange = useCallback(
    (value: number) => {
      setRoundScore((prev) =>
        handleRoundScoreChange({
          opponent,
          prevRoundScore: prev,
          gameMode,
          newScoreValue: value,
        })
      );
    },
    [gameMode, opponent, setRoundScore]
  );

  useEffect(() => {
    handleInputChange(0);
  }, [handleInputChange]);

  return (
    <View>
      <TextInput
        label={inputLabel}
        mode="outlined"
        maxLength={3}
        keyboardType="number-pad"
        style={{ minHeight: 60 }}
        value={String(opponent?.score || 0)}
        onChangeText={(value) => handleInputChange(Number(value))}
        selectTextOnFocus
      />
      <HelperText type="info">Please enter micropoints</HelperText>
    </View>
  );
}
