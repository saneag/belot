import { useCallback, useState } from "react";

import { useNavigate } from "react-router-dom";

import { StorageKeys } from "@belot/constants";
import { useLocalizations } from "@belot/localizations";
import { useGameStore } from "@belot/store";

import ConfirmationDialog from "@/components/confirmationDialog";
import { Button } from "@/components/ui/button";

import { usePreventBackPress } from "@/hooks/usePreventBackPress";

import { ArrowLeft } from "lucide-react";

import CurrentDealer from "./currentDealer";
import TimeTracker from "./timeTracker";

export default function Header() {
  const navigate = useNavigate();

  const messages = useLocalizations([
    {
      key: "game.reset.title",
    },
    {
      key: "game.reset.content",
    },
  ]);

  const [showDialog, setShowDialog] = useState(false);

  const resetGame = useGameStore((state) => state.reset);

  usePreventBackPress(() => setShowDialog(true));

  const handleReset = useCallback(() => {
    void navigate("/");
    localStorage.removeItem(StorageKeys.dealer);
    localStorage.removeItem(StorageKeys.roundsScores);
    localStorage.removeItem(StorageKeys.timerStartTime);
    localStorage.removeItem(StorageKeys.roundsScores);
    resetGame();
  }, [navigate, resetGame]);

  return (
    <div
      className="grid h-12 w-full items-center ps-2.5 pe-4"
      style={{ gridTemplateColumns: "1fr auto 1fr" }}
    >
      <ConfirmationDialog
        title={messages.gameResetTitle}
        content={messages.gameResetContent}
        renderShowDialog={(showModal) => (
          <Button
            variant="ghost"
            size="icon-lg"
            className="justify-self-start border-2"
            onClick={showModal}
          >
            <ArrowLeft />
          </Button>
        )}
        confirmationCallback={handleReset}
        visible={showDialog}
        setVisible={setShowDialog}
      />
      <CurrentDealer />
      <TimeTracker />
    </div>
  );
}
