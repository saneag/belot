import { Dispatch, SetStateAction } from "react";

import { Player, Team } from "@belot/types/game";

import ConfirmationDialog from "@/components/confirmationDialog";
import ExtendedTooltip from "@/components/extendedTooltip";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

import { useHandleNextRound } from "@/hooks/game-table/useHandleNextRound";
import { useLocalizations } from "@/localizations/useLocalization";

import { ArrowRight } from "lucide-react-native";

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
        <ExtendedTooltip
          tooltipText={messages.nextRoundTitle}
          button={
            <Button variant="solid" action="primary" onPress={() => handleDialogOpen(showDialog)}>
              <Icon as={ArrowRight} className="text-typography-100" />
            </Button>
          }
          tooltipTextClassName="text-md"
        />
      )}
      isConfirmationButtonVisible={!!rest.roundPlayer}
      confirmationCallback={handleNextRound}
      cancelCallback={handleCancel}
      primaryButton={rest.roundPlayer ? "confirm" : "cancel"}
    />
  );
}
