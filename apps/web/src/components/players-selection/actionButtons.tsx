import { useHandlePlayersSelectionResetButton } from "@belot/hooks";

import ConfirmationDialog from "@/components/confirmationDialog";
import { Button } from "@/components/ui/button";

import usePlayersSubmit from "@/hooks/players-selection/usePlayersSubmit";
import { useLocalization, useLocalizations } from "@/localizations/useLocalization";

import DealerSelectDialogContent from "./dealerSelectDialogContent";

function ResetButton() {
  const resetMsg = useLocalization("players.reset");

  const handleReset = useHandlePlayersSelectionResetButton();

  return (
    <Button variant="outline" onClick={handleReset}>
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
      confirmationCallback={() => {
        void handleSubmit();
      }}
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
