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
import { subscribeToVisibilityChange } from "@/helpers/subscribeToVisibilityChange";
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
    <HStack className="h-12 w-full items-center px-2.5">
      <View className="flex-1 items-start">
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
      </View>
      <View className="flex-1 items-center">
        <CurrentDealer
          blockWrapper={View}
          textWrapper={Text}
          textWrapperClassName="text-center"
          dealerMessage={messages.dealer}
        />
      </View>
      <View className="flex-1 items-end">
        <TimeTracker
          textWrapper={Text}
          textWrapperClassName="text-right"
          getItemFromStorage={getFromStorage}
          setItemsToStorage={setMultipleItemsToStorage}
          isVisible={() => AppState.currentState === "active"}
          subscribeToVisibilityChange={subscribeToVisibilityChange}
        />
      </View>
    </HStack>
  );
}
