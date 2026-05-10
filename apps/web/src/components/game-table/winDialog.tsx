import { type Dispatch, type SetStateAction, useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { StorageKeys } from "@belot/constants";
import { useLocalizations } from "@belot/localizations";
import { useGameStore } from "@belot/store";
import { GameMode, type Player, type Team } from "@belot/types";

import ConfirmationDialog from "@/components/confirmationDialog";

interface WinDialogProps {
  winner: Player | Team | null;
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
}

export default function WinDialog({ winner, setWinner }: WinDialogProps) {
  const navigate = useNavigate();

  const messages = useLocalizations([
    { key: "win.dialog.title.player", args: [winner?.name] },
    { key: "win.dialog.title.team", args: [winner?.name] },
    { key: "win.dialog.content" },
  ]);

  const [isVisible, setIsVisible] = useState(false);

  const gameMode = useGameStore((state) => state.mode);
  const reset = useGameStore((state) => state.reset);

  const handleGameReset = useCallback(() => {
    reset();
    setWinner(null);
    localStorage.removeItem(StorageKeys.dealer);
    localStorage.removeItem(StorageKeys.roundsScores);
    localStorage.removeItem(StorageKeys.timerStartTime);
    localStorage.removeItem(StorageKeys.roundsScores);
    void navigate("/");
  }, [reset, navigate, setWinner]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    const handleWinner = () => {
      if (winner) {
        setIsVisible(true);
      }
    };

    handleWinner();
  }, [winner]);

  return (
    <ConfirmationDialog
      title={
        gameMode === GameMode.teams ? messages.winDialogTitleTeam : messages.winDialogTitlePlayer
      }
      content={messages.winDialogContent}
      renderShowDialog={() => <></>}
      visible={isVisible}
      setVisible={setIsVisible}
      confirmationCallback={handleGameReset}
      cancelCallback={handleClose}
      asChild
      primaryButton="confirm"
    />
  );
}
