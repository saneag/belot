import { type Dispatch, type SetStateAction } from "react";

import { useNavigate } from "react-router-dom";

import { useGameReset } from "@belot/hooks";
import { useLocalization } from "@belot/localizations";
import { type Player, type Team } from "@belot/types";

import { Button } from "@/components/ui/button";

import { removeItemsFromStorage } from "@/helpers/storageHelpers";

interface ResetGameButtonProps {
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
}

export default function ResetGameButton({ setWinner }: ResetGameButtonProps) {
  const navigate = useNavigate();

  const resetGameButtonMsg = useLocalization("game.reset.submit.button");

  const { handleReset } = useGameReset({
    navigateFunction: () => void navigate("/"),
    removeItemsFromStorage,
    onComplete: () => setWinner(null),
  });

  return (
    <Button className="self-center" onClick={() => void handleReset()}>
      {resetGameButtonMsg}
    </Button>
  );
}
