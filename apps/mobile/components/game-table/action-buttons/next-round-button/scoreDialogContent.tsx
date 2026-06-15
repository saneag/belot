import { VStack } from "@/components/ui/vstack";

import DialogPointsTypeToggle from "./dialogPointsTypeToggle";
import PlayerScoreInputWrapper from "./playerScoreInputWrapper";
import RoundPlayerDisplay, { RoundPlayerDisplayProps } from "./roundPlayerDisplay";
import RoundPlayerSelect from "./roundPlayerSelect";
import RoundScoreSelect, { RoundScoreSelectProps } from "./roundScoreSelect";

type ScoreDialogContentProps = RoundPlayerDisplayProps &
  Pick<RoundScoreSelectProps, "roundScore" | "setRoundScore"> & {
    dialogPointsType: string;
    onDialogPointsTypeChange: (pointsType: string) => void;
  };

export default function ScoreDialogContent(props: ScoreDialogContentProps) {
  if (!props.roundPlayer) {
    return <RoundPlayerSelect setRoundPlayer={props.setRoundPlayer} />;
  }

  return (
    <VStack space="md">
      <RoundPlayerDisplay roundPlayer={props.roundPlayer} setRoundPlayer={props.setRoundPlayer} />
      <DialogPointsTypeToggle
        value={props.dialogPointsType}
        onChange={props.onDialogPointsTypeChange}
      />
      <RoundScoreSelect
        roundScore={props.roundScore}
        setRoundScore={props.setRoundScore}
        pointsType={props.dialogPointsType}
      />
      <PlayerScoreInputWrapper
        roundScore={props.roundScore}
        setRoundScore={props.setRoundScore}
        roundPlayer={props.roundPlayer}
        pointsType={props.dialogPointsType}
      />
    </VStack>
  );
}
