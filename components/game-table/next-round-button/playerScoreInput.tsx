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
} from '../../../helpers/gameScoreHelpers';
import {
  GameMode,
  PlayerScore,
  RoundScore,
  TeamScore,
} from '../../../types/game';

interface PlayerScoreInputProps {
  opponent: PlayerScore | TeamScore;
  roundScore: RoundScore;
  setRoundScore: Dispatch<SetStateAction<RoundScore>>;
  gameMode: GameMode;
}

export default function PlayerScoreInput({
  opponent,
  roundScore,
  setRoundScore,
  gameMode,
}: PlayerScoreInputProps) {
  const finalOpponent = useMemo(
    () => prepareRoundScoresBasedOnGameMode(gameMode, roundScore, opponent),
    [gameMode, opponent, roundScore]
  );

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
        label="Score"
        mode="outlined"
        maxLength={3}
        keyboardType="number-pad"
        style={{ minHeight: 60 }}
        value={String(finalOpponent?.score || 0)}
        onChangeText={(value) => handleInputChange(Number(value))}
        selectTextOnFocus
      />
      <HelperText type="info">Please enter micropoints</HelperText>
    </View>
  );
}
