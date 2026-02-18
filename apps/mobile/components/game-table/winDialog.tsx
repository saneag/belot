import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "expo-router";

import { useGameStore } from "@belot/store";
import { GameMode, Player, Team } from "@belot/types";

import ConfirmationDialog from "@/components/confirmationDialog";

import { formatLocalizationString, useLocalizations } from "@/localizations/useLocalization";

interface WinDialogProps {
  winner: Player | Team | null;
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
}

export default function WinDialog({ winner, setWinner }: WinDialogProps) {
  const router = useRouter();

  const messages = useLocalizations([
    { key: "win.dialog.title.player" },
    { key: "win.dialog.title.team" },
    { key: "win.dialog.content" },
  ]);

  const [isVisible, setIsVisible] = useState(false);

  const gameMode = useGameStore((state) => state.mode);
  const reset = useGameStore((state) => state.reset);

  const formattedTitle = useMemo(() => {
    if (gameMode === GameMode.classic) {
      return formatLocalizationString(messages.winDialogTitlePlayer, [winner?.name]);
    }

    return formatLocalizationString(messages.winDialogTitleTeam, [winner?.name]);
  }, [gameMode, messages.winDialogTitlePlayer, messages.winDialogTitleTeam, winner?.name]);

  const handleGameReset = useCallback(() => {
    reset();
    setWinner(null);
    router.back();
  }, [reset, router, setWinner]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (winner) {
      setIsVisible(true);
    }
  }, [winner]);

  return (
    <ConfirmationDialog
      title={formattedTitle}
      content={messages.winDialogContent}
      renderShowDialog={() => <></>}
      visible={isVisible}
      setVisible={setIsVisible}
      confirmationCallback={handleGameReset}
      cancelCallback={handleClose}
      asChild
    />
  );
}
