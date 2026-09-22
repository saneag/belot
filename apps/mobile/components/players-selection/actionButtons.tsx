import { useRouter } from "expo-router";

import { useHandlePlayersSelectionResetButton, usePlayersSubmit } from "@belot/hooks";
import { useLocalization, useLocalizations } from "@belot/localizations";

import ConfirmationDialog from "@/components/confirmationDialog";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";

import { getFromStorage, setMultipleItemsToStorage } from "@/helpers/storageHelpers";

import DealerSelectDialogContent from "./dealerSelectDialogContent";

function ResetButton() {
  const resetMsg = useLocalization("players.reset");

  const handleReset = useHandlePlayersSelectionResetButton();

  return (
    <Button variant="solid" action="secondary" onPress={handleReset}>
      <ButtonText>{resetMsg}</ButtonText>
    </Button>
  );
}

function SubmitButton() {
  const router = useRouter();

  const messages = useLocalizations([
    { key: "players.submit.dialog.title" },
    { key: "players.submit.dialog.button" },
  ]);

  const { handleOpenDialog, handleSubmit } = usePlayersSubmit({
    navigateFunction: () => router.replace("/game-table"),
    setItemsToStorage: setMultipleItemsToStorage,
    getFromStorage,
  });

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
