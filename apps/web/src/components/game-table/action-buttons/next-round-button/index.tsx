import { type Dispatch, type SetStateAction } from "react";

import { type Player, type Team } from "@belot/types";

import ConfirmationDialog from "@/components/confirmationDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { useHandleNextRound } from "@/hooks/game-table/useHandleNextRound";
import { useLocalizations } from "@/localizations/useLocalization";

import { ArrowRight } from "lucide-react";

import ScoreDialogContent from "./scoreDialogContent";

interface NextRoundButtonProps {
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
}

export default function NextRoundButton({ setWinner }: NextRoundButtonProps) {
  const messages = useLocalizations([{ key: "next.round.title" }, { key: "next.round.button" }]);

  const { handleNextRound, handleCancel, handleDialogOpen, ...rest } = useHandleNextRound({
    setWinner,
  });

  return (
    <ConfirmationDialog
      title={messages.nextRoundTitle}
      content={<ScoreDialogContent {...rest} />}
      renderShowDialog={(showDialog) => (
        <Tooltip>
          <TooltipTrigger onClick={() => handleDialogOpen(showDialog)}>
            <ArrowRight />
          </TooltipTrigger>
          <TooltipContent>
            <p>{messages.nextRoundTitle}</p>
          </TooltipContent>
        </Tooltip>
      )}
      isConfirmationButtonVisible={!!rest.roundPlayer}
      confirmationCallback={handleNextRound}
      cancelCallback={handleCancel}
      primaryButton={rest.roundPlayer ? "confirm" : "cancel"}
    />
  );
}
