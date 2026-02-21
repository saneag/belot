import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useLocalizations } from "@/localizations/useLocalization";

import PlayerScoreInputWrapper from "./playerScoreInputWrapper";
import RoundPlayerDisplay from "./roundPlayerDisplay";
import RoundPlayerSelect, { RoundPlayerSelectProps } from "./roundPlayerSelect";
import RoundScoreSelect, { RoundScoreSelectProps } from "./roundScoreSelect";

type ScoreDialogContentProps = RoundPlayerSelectProps & RoundScoreSelectProps;

export default function ScoreDialogContent(props: ScoreDialogContentProps) {
  const messages = useLocalizations([{ key: "next.round.score.for.player.input.helper" }]);

  if (!props.roundPlayer) {
    return (
      <RoundPlayerSelect roundPlayer={props.roundPlayer} setRoundPlayer={props.setRoundPlayer} />
    );
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
