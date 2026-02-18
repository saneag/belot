import { useCallback } from "react";

import { useGameStore } from "@belot/store";

import ConfirmationDialog from "@/components/confirmationDialog";
import ExtendedTooltip from "@/components/extendedTooltip";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

import { useLocalizations } from "@/localizations/useLocalization";

import { ChevronsRight } from "lucide-react-native";

export default function SkipRoundButton() {
  const messages = useLocalizations([{ key: "skip.round.title" }, { key: "skip.round.content" }]);

  const skipRound = useGameStore((state) => state.skipRound);

  const handleAddEmptyRow = useCallback(() => {
    skipRound();
  }, [skipRound]);

  return (
    <ConfirmationDialog
      title={messages.skipRoundTitle}
      content={messages.skipRoundContent}
      renderShowDialog={(showDialog) => (
        <ExtendedTooltip
          tooltipText={messages.skipRoundTitle}
          tooltipTextClassName="text-md"
          button={
            <Button variant="solid" action="secondary" onPress={showDialog}>
              <Icon as={ChevronsRight} />
            </Button>
          }
        />
      )}
      confirmationCallback={handleAddEmptyRow}
    />
  );
}
