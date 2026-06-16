import { Dispatch, SetStateAction, useCallback } from "react";

import { useRouter } from "expo-router";

import { StorageKeys } from "@belot/constants";
import { useLocalization } from "@belot/localizations";
import { useGameStore } from "@belot/store";
import { Player, Team } from "@belot/types";

import { Button, ButtonText } from "@/components/ui/button";

import { removeFromStorage } from "@/helpers/storageHelpers";

interface ResetGameButtonProps {
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
}

export default function ResetGameButton({ setWinner }: ResetGameButtonProps) {
  const router = useRouter();

  const resetGameButtonMsg = useLocalization("game.reset.submit.button");

  const markForReset = useGameStore((state) => state.markForReset);

  const handleReset = useCallback(() => {
    removeFromStorage(StorageKeys.dealer);
    removeFromStorage(StorageKeys.roundsScores);
    removeFromStorage(StorageKeys.timerStartTime);
    setWinner(null);
    markForReset();
    router.replace("/starting-screen");
  }, [markForReset, router, setWinner]);

  return (
    <Button variant="solid" action="secondary" className="self-center" onPress={handleReset}>
      <ButtonText>{resetGameButtonMsg}</ButtonText>
    </Button>
  );
}
