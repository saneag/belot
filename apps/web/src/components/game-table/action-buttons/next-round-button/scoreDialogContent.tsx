import { useLocalizations } from "@/localizations/useLocalization";

import PlayerScoreInputWrapper from "./playerScoreInputWrapper";
import RoundPlayerDisplay, { type RoundPlayerDisplayProps } from "./roundPlayerDisplay";
import RoundPlayerSelect from "./roundPlayerSelect";
import RoundScoreSelect, { type RoundScoreSelectProps } from "./roundScoreSelect";

type ScoreDialogContentProps = RoundPlayerDisplayProps & RoundScoreSelectProps;

export default function ScoreDialogContent(props: ScoreDialogContentProps) {
  const messages = useLocalizations([{ key: "next.round.score.for.player.input.helper" }]);

  if (!props.roundPlayer) {
    return <RoundPlayerSelect setRoundPlayer={props.setRoundPlayer} />;
  }

  return (
    <div className="flex flex-col gap-2.5">
      <RoundPlayerDisplay roundPlayer={props.roundPlayer} setRoundPlayer={props.setRoundPlayer} />
      <RoundScoreSelect roundScore={props.roundScore} setRoundScore={props.setRoundScore} />
      <PlayerScoreInputWrapper
        roundScore={props.roundScore}
        setRoundScore={props.setRoundScore}
        roundPlayer={props.roundPlayer}
      />
      <span className="text-error-400 text-center">
        {"* " + messages.nextRoundScoreForPlayerInputHelper}
      </span>
    </div>
  );
}
