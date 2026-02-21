import { useCallback } from "react";

import { useGameStore } from "@belot/store";

import ConfirmationDialog from "@/components/confirmationDialog";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";

import usePlayersSubmit from "@/hooks/players-selection/usePlayersSubmit";
import { useLocalization, useLocalizations } from "@/localizations/useLocalization";

import DealerSelectDialogContent from "./dealerSelectDialogContent";
import { usePlayersSelectionContext } from "./playersSelectionContext";

function ResetButton() {
  const resetMsg = useLocalization("players.reset");
  const { resetValidations } = usePlayersSelectionContext();
  const resetGameStore = useGameStore((state) => state.reset);

  const handleReset = useCallback(() => {
    resetGameStore();
    resetValidations();
  }, [resetGameStore, resetValidations]);

  return (
    <Button variant="solid" action="secondary" onPress={handleReset}>
      <ButtonText>{resetMsg}</ButtonText>
    </Button>
  );
}

function SubmitButton() {
  const messages = useLocalizations([
    { key: "players.submit.dialog.title" },
    { key: "players.submit.dialog.button" },
  ]);

  const { handleOpenDialog, handleSubmit } = usePlayersSubmit();

  return (
    <ConfirmationDialog
      title={messages.playersSubmitDialogTitle}
      content={<DealerSelectDialogContent />}
      renderShowDialog={(showDialog) => (
        <Button variant="solid" action="primary" onPress={() => handleOpenDialog(showDialog)}>
          <ButtonText>{messages.playersSubmitDialogButton}</ButtonText>
        </Button>
      )}
      confirmationCallback={handleSubmit}
      primaryButton="confirm"
    />
  );
}

export default function ActionButtons() {
  return (
    <HStack className="justify-between gap-2.5">
      <ResetButton />
      <SubmitButton />
    </HStack>
  );
}
