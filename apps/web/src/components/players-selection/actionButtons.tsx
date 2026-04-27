import { useNavigate } from "react-router-dom";

import { useHandlePlayersSelectionResetButton } from "@belot/hooks";
import { usePlayersSubmit } from "@belot/hooks";
import { useLocalization, useLocalizations } from "@belot/localizations";

import ConfirmationDialog from "@/components/confirmationDialog";
import { Button } from "@/components/ui/button";

import { getApiBaseUrl } from "@/helpers/apiBaseUrl";
import { setMultipleItemsToStorage } from "@/helpers/storageHelpers";

import { toast } from "sonner";

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
  const navigate = useNavigate();

  const messages = useLocalizations([
    { key: "players.submit.dialog.title" },
    { key: "players.submit.dialog.button" },
    { key: "server.offline" },
  ]);

  const { handleOpenDialog, handleSubmit } = usePlayersSubmit({
    navigateFunction: () => void navigate("/game-table", { replace: true }),
    setItemsToStorage: setMultipleItemsToStorage,
    getApiBaseUrl,
    handleCatchError: () => {
      toast.error(messages.serverOffline);
    },
  });

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
