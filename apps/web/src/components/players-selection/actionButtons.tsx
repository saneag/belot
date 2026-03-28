import { useCallback } from "react";

import { useGameStore } from "@belot/store";

import ConfirmationDialog from "@/components/confirmationDialog";
import { Button } from "@/components/ui/button";

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
    <Button variant="secondary" onClick={handleReset}>
      {resetMsg}
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
        <Button onClick={() => handleOpenDialog(showDialog)}>
          {messages.playersSubmitDialogButton}
        </Button>
      )}
      confirmationCallback={handleSubmit}
      primaryButton="confirm"
    />
  );
}

export default function ActionButtons() {
  return (
    <div className="flex justify-between gap-2.5">
      <ResetButton />
      <SubmitButton />
    </div>
  );
}
