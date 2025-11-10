import { View } from 'react-native';
import PlayerScoreInput, { PlayerScoreInputProps } from './playerScoreInput';
import RoundPlayer from './roundPlayer';
import RoundPlayerSelect, { RoundPlayerSelectProps } from './roundPlayerSelect';
import RoundScoreSelect, { RoundScoreSelectProps } from './roundScoreSelect';

interface ScoreDialogContentProps
  extends PlayerScoreInputProps,
    RoundPlayerSelectProps,
    RoundScoreSelectProps {}

export default function ScoreDialogContent({
  inputValue,
  roundPlayer,
  roundScore,
  setInputValue,
  setRoundPlayer,
  setRoundScore,
}: ScoreDialogContentProps) {
  if (!roundPlayer) {
    return (
      <RoundPlayerSelect
        roundPlayer={roundPlayer}
        setRoundPlayer={setRoundPlayer}
      />
    );
  }

  return (
    <View style={{ gap: 10 }}>
      <RoundPlayer
        roundPlayer={roundPlayer}
        setRoundPlayer={setRoundPlayer}
      />
      <RoundScoreSelect
        roundScore={roundScore}
        setRoundScore={setRoundScore}
      />
      <PlayerScoreInput
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
    </View>
  );
}
