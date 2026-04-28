import React from "react";

import { AppState, View } from "react-native";

import { useRouter } from "expo-router";

import { CurrentDealer, TimeTracker } from "@belot/components";
import { useHandleGameReset } from "@belot/hooks";
import { useLocalizations } from "@belot/localizations";

import ConfirmationDialog from "@/components/confirmationDialog";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { ArrowLeftIcon, Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

import { getFromStorage, setMultipleItemsToStorage } from "@/helpers/storageHelpers";
import { usePreventBackPress } from "@/hooks/usePreventBackPress";

export default function Header() {
  const router = useRouter();

  const messages = useLocalizations([
    {
      key: "game.reset.title",
    },
    {
      key: "game.reset.content",
    },
    {
      key: "dealer",
    },
  ]);

  const { showDialog, setShowDialog, handleReset } = useHandleGameReset({
    navigateFunction: () => router.navigate("/players-selection"),
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
      <CurrentDealer blockWrapper={View} textWrapper={Text} dealerMessage={messages.dealer} />
      <TimeTracker
        textWrapper={Text}
        getItemFromStorage={getFromStorage}
        setItemsToStorage={setMultipleItemsToStorage}
        isVisible={() => AppState.currentState === "active"}
        subscribeToVisibilityChange={(handleVisibilityChange) => {
          const subscription = AppState.addEventListener("change", (state) => {
            if (state === "active") {
              handleVisibilityChange();
            }
          });

          return () => {
            subscription.remove();
          };
        }}
      />
    </HStack>
  );
}
