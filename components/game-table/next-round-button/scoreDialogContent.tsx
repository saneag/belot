import { View } from 'react-native';
import { useGameStore } from '../../../store/game';
import PlayerScoreInput, { PlayerScoreInputProps } from './playerScoreInput';
import RoundPlayer from './roundPlayer';
import RoundPlayerSelect from './roundPlayerSelect';
import RoundScoreSelect, { RoundScoreSelectProps } from './roundScoreSelect';

interface ScoreDialogContentProps
  extends PlayerScoreInputProps,
    RoundScoreSelectProps {}

export default function ScoreDialogContent({
  inputValue,
  roundScore,
  setInputValue,
  setRoundScore,
}: ScoreDialogContentProps) {
  const roundPlayer = useGameStore((state) => state.roundPlayer);

  if (!roundPlayer) {
    return <RoundPlayerSelect />;
  }

  return (
    <View style={{ gap: 10 }}>
      <RoundPlayer />
      <RoundScoreSelect roundScore={roundScore} setRoundScore={setRoundScore} />
      <PlayerScoreInput inputValue={inputValue} setInputValue={setInputValue} />
    </View>
  );
}
