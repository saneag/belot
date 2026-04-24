import { PlayersSelectionContextProvider } from "@belot/components";

import DismissKeyboardView from "@/components/dismissKeyboardView";
import ActionButtons from "@/components/players-selection/actionButtons";
import LoadPreviousGameButton from "@/components/players-selection/loadPreviousGameButton";
import PlayersCount from "@/components/players-selection/playersCount";
import PlayersNames from "@/components/players-selection/playersNames";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";

import { useLoadPreviousGame } from "@/hooks/players-selection/useLoadPreviousGame";
import { useLocalization } from "@/localizations/useLocalization";

export default function PlayersSelectionScreen() {
  const playersSetupMsg = useLocalization("players.setup");

  useLoadPreviousGame();

  return (
    <Center className="flex-1 bg-background-0 px-2.5">
      <DismissKeyboardView>
        <VStack className="gap-5">
          <Heading size="4xl" className="text-center font-normal">
            {playersSetupMsg}
          </Heading>

          <VStack className="gap-3">
            <PlayersSelectionContextProvider>
              <PlayersCount />
              <PlayersNames />
              <ActionButtons />
            </PlayersSelectionContextProvider>
            <LoadPreviousGameButton />
          </VStack>
        </VStack>
      </DismissKeyboardView>
    </Center>
  );
}
