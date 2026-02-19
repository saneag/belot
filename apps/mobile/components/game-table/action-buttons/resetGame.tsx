import { Dispatch, SetStateAction, useCallback } from "react";

import { useRouter } from "expo-router";

import { useGameStore } from "@belot/store";
import { Player, Team } from "@belot/types";

import { Button, ButtonText } from "@/components/ui/button";

import { useLocalization } from "@/localizations/useLocalization";

interface ResetGameButtonProps {
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
}

export default function ResetGameButton({ setWinner }: ResetGameButtonProps) {
  const router = useRouter();

  const resetGameButtonMsg = useLocalization("game.reset.submit.button");

  const reset = useGameStore((state) => state.reset);

  const handleReset = useCallback(() => {
    reset();
    setWinner(null);
    router.back();
  }, [reset, router, setWinner]);

  return (
    <Button variant="solid" action="secondary" className="self-center" onPress={handleReset}>
      <ButtonText>{resetGameButtonMsg}</ButtonText>
    </Button>
  );
}
