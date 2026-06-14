import { useMemo } from "react";

import { useLocalizations } from "@belot/localizations";
import { useGameStore } from "@belot/store";

import ExtendedTooltip from "@/components/extendedTooltip";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

import { Undo } from "lucide-react-native";

export default function UndoRoundButton() {
  const messages = useLocalizations([
    {
      key: "undo.round.title",
    },
  ]);

  const roundsScores = useGameStore((state) =>
    Array.isArray(state.roundsScores) ? state.roundsScores : [],
  );
  const undoRoundScore = useGameStore((state) => state.undoRoundScore);

  const roundsScoresCount = useMemo(() => roundsScores.length, [roundsScores.length]);

  const isUndoDisabled = roundsScoresCount === 1;

  return (
    <ExtendedTooltip
      tooltipText={messages.undoRoundTitle}
      button={
        <Button
          variant="solid"
          action="secondary"
          onPress={undoRoundScore}
          disabled={isUndoDisabled}
          className={isUndoDisabled ? "cursor-not-allowed opacity-50" : ""}
        >
          <Icon as={Undo} />
        </Button>
      }
      tooltipTextClassName="text-md"
    />
  );
}
