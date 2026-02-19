import { View } from "react-native";

import PlayerScoreInputWrapper from "./playerScoreInputWrapper";
import RoundPlayerDisplay from "./roundPlayerDisplay";
import RoundPlayerSelect, { RoundPlayerSelectProps } from "./roundPlayerSelect";
import RoundScoreSelect, { RoundScoreSelectProps } from "./roundScoreSelect";

type ScoreDialogContentProps = RoundPlayerSelectProps & RoundScoreSelectProps;

export default function ScoreDialogContent(props: ScoreDialogContentProps) {
  if (!props.roundPlayer) {
    return (
      <RoundPlayerSelect roundPlayer={props.roundPlayer} setRoundPlayer={props.setRoundPlayer} />
    );
  }

  return (
    <View style={{ gap: 10 }}>
      <RoundPlayerDisplay roundPlayer={props.roundPlayer} setRoundPlayer={props.setRoundPlayer} />
      <RoundScoreSelect roundScore={props.roundScore} setRoundScore={props.setRoundScore} />
      <PlayerScoreInputWrapper
        roundScore={props.roundScore}
        setRoundScore={props.setRoundScore}
        roundPlayer={props.roundPlayer}
      />
    </View>
  );
}
