import { Dispatch, SetStateAction } from "react";

import { useRouter } from "expo-router";

import { useGameReset } from "@belot/hooks";
import { useLocalization } from "@belot/localizations";
import { useGameStore } from "@belot/store";
import { Player, Team } from "@belot/types";

import { Button, ButtonText } from "@/components/ui/button";

import { removeItemsFromStorage } from "@/helpers/storageHelpers";

interface ResetGameButtonProps {
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
}

export default function ResetGameButton({ setWinner }: ResetGameButtonProps) {
  const router = useRouter();

  const resetGameButtonMsg = useLocalization("game.reset.submit.button");

  const markForReset = useGameStore((state) => state.markForReset);

  const { handleReset } = useGameReset({
    navigateFunction: () => router.replace("/starting-screen"),
    removeItemsFromStorage,
    afterNavigate: markForReset,
    onComplete: () => setWinner(null),
  });

  return (
    <Button
      variant="solid"
      action="secondary"
      className="self-center"
      onPress={() => void handleReset()}
    >
      <ButtonText>{resetGameButtonMsg}</ButtonText>
    </Button>
  );
}
