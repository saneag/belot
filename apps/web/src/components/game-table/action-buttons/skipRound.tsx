import { useHandleSkipRound } from "@belot/hooks";
import { useLocalizations } from "@belot/localizations";

import ConfirmationDialog from "@/components/confirmationDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { setMultipleItemsToStorage } from "@/helpers/storageHelpers";

import { ChevronsRight } from "lucide-react";

export default function SkipRoundButton() {
  const messages = useLocalizations([{ key: "skip.round.title" }, { key: "skip.round.content" }]);

  const handleAddEmptyRow = useHandleSkipRound({
    setItemsToStorage: setMultipleItemsToStorage,
  });

  return (
    <ConfirmationDialog
      title={messages.skipRoundTitle}
      content={messages.skipRoundContent}
      renderShowDialog={(showDialog) => (
        <Tooltip>
          <TooltipTrigger onClick={showDialog} className="rounded-lg px-4 py-1">
            <ChevronsRight />
          </TooltipTrigger>
          <TooltipContent>
            <p>{messages.skipRoundTitle}</p>
          </TooltipContent>
        </Tooltip>
      )}
      confirmationCallback={handleAddEmptyRow}
    />
  );
}
