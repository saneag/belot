import { View } from 'react-native';
import PlayerScoreInput from './playerScoreInput';
import RoundPlayerDisplay from './roundPlayerDisplay';
import RoundPlayerSelect, { RoundPlayerSelectProps } from './roundPlayerSelect';
import RoundScoreSelect, { RoundScoreSelectProps } from './roundScoreSelect';

type ScoreDialogContentProps = RoundPlayerSelectProps & RoundScoreSelectProps;

export default function ScoreDialogContent(props: ScoreDialogContentProps) {
  if (!props.roundPlayer) {
    return (
      <RoundPlayerSelect
        roundPlayer={props.roundPlayer}
        setRoundPlayer={props.setRoundPlayer}
      />
    );
  }

  return (
    <View style={{ gap: 10 }}>
      <RoundPlayerDisplay
        roundPlayer={props.roundPlayer}
        setRoundPlayer={props.setRoundPlayer}
      />
      <RoundScoreSelect
        roundScore={props.roundScore}
        setRoundScore={props.setRoundScore}
      />
      <PlayerScoreInput />
    </View>
  );
}
