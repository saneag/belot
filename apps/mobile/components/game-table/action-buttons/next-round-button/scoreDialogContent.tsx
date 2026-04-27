import { useLocalizations } from "@belot/localizations";

import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import PlayerScoreInputWrapper from "./playerScoreInputWrapper";
import RoundPlayerDisplay, { RoundPlayerDisplayProps } from "./roundPlayerDisplay";
import RoundPlayerSelect from "./roundPlayerSelect";
import RoundScoreSelect, { RoundScoreSelectProps } from "./roundScoreSelect";

type ScoreDialogContentProps = RoundPlayerDisplayProps & RoundScoreSelectProps;

export default function ScoreDialogContent(props: ScoreDialogContentProps) {
  const messages = useLocalizations([{ key: "next.round.score.for.player.input.helper" }]);

  if (!props.roundPlayer) {
    return <RoundPlayerSelect setRoundPlayer={props.setRoundPlayer} />;
  }

  return (
    <VStack space="md">
      <RoundPlayerDisplay roundPlayer={props.roundPlayer} setRoundPlayer={props.setRoundPlayer} />
      <RoundScoreSelect roundScore={props.roundScore} setRoundScore={props.setRoundScore} />
      <PlayerScoreInputWrapper
        roundScore={props.roundScore}
        setRoundScore={props.setRoundScore}
        roundPlayer={props.roundPlayer}
      />
      <Text size="sm" className="text-center text-error-400">
        {"* " + messages.nextRoundScoreForPlayerInputHelper}
      </Text>
    </VStack>
  );
}
