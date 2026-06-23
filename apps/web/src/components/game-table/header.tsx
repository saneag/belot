import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { CurrentDealer } from "@belot/components";
import { TimeTracker } from "@belot/components";
import { useHandleGameReset } from "@belot/hooks";
import { useLocalizations } from "@belot/localizations";

import ConfirmationDialog from "@/components/confirmationDialog";
import { Button } from "@/components/ui/button";

import { removeItemsFromStorage, setMultipleItemsToStorage } from "@/helpers/storageHelpers";
import { subscribeToVisibilityChange } from "@/helpers/subscribeToVisibilityChange";
import { usePreventBackPress } from "@/hooks/usePreventBackPress";

import { ArrowLeft } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();

  const messages = useLocalizations([
    {
      key: "game.reset.title",
    },
    {
      key: "game.reset.content",
    },
    {
      key: "dealer",
    },
  ]);

  const { showDialog, setShowDialog, handleReset } = useHandleGameReset({
    navigateFunction: () =>
      void navigate("/", {
        replace: true,
      }),
    removeItemsFromStorage,
  });

  const blocker = usePreventBackPress(() => {
    setShowDialog(true);
  });

  useEffect(() => {
    if (!showDialog && blocker.state === "blocked") {
      blocker.reset();
    }
  }, [blocker, showDialog]);

  return (
    <div
      className="grid h-12 w-full items-center ps-2.5 pe-4"
      style={{ gridTemplateColumns: "1fr auto 1fr" }}
    >
      <ConfirmationDialog
        title={messages.gameResetTitle}
        content={messages.gameResetContent}
        renderShowDialog={(showModal) => (
          <Button variant="ghost" size="icon" onClick={showModal}>
            <ArrowLeft className="size-5" />
          </Button>
        )}
        confirmationCallback={() => {
          void handleReset();
        }}
        visible={showDialog}
        setVisible={setShowDialog}
      />
      <CurrentDealer blockWrapper="div" textWrapper="span" dealerMessage={messages.dealer} />
      <TimeTracker
        textWrapper="span"
        textWrapperClassName="justify-self-end"
        getItemFromStorage={(key) => localStorage.getItem(key)}
        setItemsToStorage={setMultipleItemsToStorage}
        isVisible={() => document.visibilityState === "visible"}
        subscribeToVisibilityChange={subscribeToVisibilityChange}
      />
    </div>
  );
}
