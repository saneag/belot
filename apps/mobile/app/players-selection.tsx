import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { PlayersSelectionContextProvider } from "@belot/components";

import { BackButton } from "@/components/backButton";
import DismissKeyboardView from "@/components/dismissKeyboardView";
import ActionButtons from "@/components/players-selection/actionButtons";
import LoadPreviousGameButton from "@/components/players-selection/loadPreviousGameButton";
import PlayersCount from "@/components/players-selection/playersCount";
import PlayersNames from "@/components/players-selection/playersNames";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";

export default function PlayersSelectionScreen() {
  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-phone-screen-background"
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
    >
      <BackButton />
      <Center className="flex-1 px-2.5">
        <DismissKeyboardView>
          <VStack className="gap-3">
            <PlayersSelectionContextProvider>
              <PlayersCount />
              <PlayersNames />
              <ActionButtons />
            </PlayersSelectionContextProvider>
            <LoadPreviousGameButton />
          </VStack>
        </DismissKeyboardView>
      </Center>
    </KeyboardAwareScrollView>
  );
}
