import React from "react";

import { useRouter } from "expo-router";

import { useHandleGameReset } from "@belot/hooks";
import { useLocalizations } from "@belot/localizations";

import ConfirmationDialog from "@/components/confirmationDialog";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { ArrowLeftIcon, Icon } from "@/components/ui/icon";

import { setMultipleItemsToStorage } from "@/helpers/storageHelpers";
import { usePreventBackPress } from "@/hooks/usePreventBackPress";

import CurrentDealer from "./currentDealer";
import TimeTracker from "./timeTracker";

export default function Header() {
  const router = useRouter();
  const messages = useLocalizations([
    {
      key: "game.reset.title",
    },
    {
      key: "game.reset.content",
    },
  ]);

  const { showDialog, setShowDialog, handleReset } = useHandleGameReset({
    navigateFunction: () => router.navigate("/"),
    setItemsToStorage: setMultipleItemsToStorage,
  });

  usePreventBackPress(() => {
    setShowDialog(true);
  });

  return (
    <HStack className="items-center justify-between px-2.5">
      <ConfirmationDialog
        title={messages.gameResetTitle}
        content={messages.gameResetContent}
        renderShowDialog={(showModal) => (
          <Button variant="link" onPress={showModal}>
            <Icon as={ArrowLeftIcon} />
          </Button>
        )}
        confirmationCallback={handleReset}
        visible={showDialog}
        setVisible={setShowDialog}
      />
      <CurrentDealer />
      <TimeTracker />
    </HStack>
  );
}
