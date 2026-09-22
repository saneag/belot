import { useNavigate } from "react-router-dom";

import { useHandlePlayersSelectionResetButton } from "@belot/hooks";
import { usePlayersSubmit } from "@belot/hooks";
import { useLocalization, useLocalizations } from "@belot/localizations";

import ConfirmationDialog from "@/components/confirmationDialog";
import { Button } from "@/components/ui/button";

import { getFromStorage, setMultipleItemsToStorage } from "@/helpers/storageHelpers";

import DealerSelectDialogContent from "./dealerSelectDialogContent";

function ResetButton() {
  const resetMsg = useLocalization("players.reset");

  const handleReset = useHandlePlayersSelectionResetButton();

  return (
    <Button variant="outline" onClick={handleReset} data-testid="players-reset-button">
      {resetMsg}
    </Button>
  );
}

function SubmitButton() {
  const navigate = useNavigate();

  const messages = useLocalizations([
    { key: "players.submit.dialog.title" },
    { key: "players.submit.dialog.button" },
  ]);

  const { handleOpenDialog, handleSubmit } = usePlayersSubmit({
    navigateFunction: () => void navigate("/game-table", { replace: true }),
    setItemsToStorage: setMultipleItemsToStorage,
    getFromStorage,
  });

  return (
    <ConfirmationDialog
      title={messages.playersSubmitDialogTitle}
      content={<DealerSelectDialogContent />}
      renderShowDialog={(showDialog) => (
        <Button onClick={() => handleOpenDialog(showDialog)} data-testid="players-submit-button">
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
