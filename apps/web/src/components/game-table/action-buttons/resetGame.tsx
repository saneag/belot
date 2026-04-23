import { type Dispatch, type SetStateAction, useCallback } from "react";

import { useNavigate } from "react-router-dom";

import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";
import { type Player, type Team } from "@belot/types";

import { Button } from "@/components/ui/button";

import { useLocalization } from "@/localizations/useLocalization";

interface ResetGameButtonProps {
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
}

export default function ResetGameButton({ setWinner }: ResetGameButtonProps) {
  const navigate = useNavigate();

  const resetGameButtonMsg = useLocalization("game.reset.submit.button");

  const reset = useGameStore((state) => state.reset);

  const handleReset = useCallback(() => {
    reset();
    setWinner(null);
    localStorage.removeItem(StorageKeys.dealer);
    localStorage.removeItem(StorageKeys.roundsScores);
    localStorage.removeItem(StorageKeys.timerStartTime);
    localStorage.removeItem(StorageKeys.roundsScores);
    void navigate("/");
  }, [reset, navigate, setWinner]);

  return (
    <Button className="self-center" onClick={handleReset}>
      {resetGameButtonMsg}
    </Button>
  );
}
