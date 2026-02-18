import { useMemo } from "react";

import { useGameStore } from "@belot/store";

import ExtendedTooltip from "@/components/extendedTooltip";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

import { useLocalizations } from "@/localizations/useLocalization";

import { Undo } from "lucide-react-native";

export default function UndoRoundButton() {
  const messages = useLocalizations([
    {
      key: "undo.round.title",
    },
  ]);

  const roundsScores = useGameStore((state) => state.roundsScores);
  const undoRoundScore = useGameStore((state) => state.undoRoundScore);

  const roundsScoresCount = useMemo(() => roundsScores.length, [roundsScores.length]);

  return (
    <ExtendedTooltip
      tooltipText={messages.undoRoundTitle}
      button={
        <Button
          variant="solid"
          action="secondary"
          onPress={undoRoundScore}
          disabled={roundsScoresCount === 1}
        >
          <Icon as={Undo} />
        </Button>
      }
      tooltipTextClassName="text-md"
    />
  );
}
