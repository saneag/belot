import { useMemo } from "react";

import { useLocalizations } from "@belot/localizations";
import { useGameStore } from "@belot/store";

import ExtendedTooltip from "@/components/extendedTooltip";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

import { Redo } from "lucide-react-native";

export default function RedoRoundButton() {
  const messages = useLocalizations([
    {
      key: "redo.round.title",
    },
  ]);

  const undoneRoundsScores = useGameStore((state) =>
    Array.isArray(state.undoneRoundsScores) ? state.undoneRoundsScores : [],
  );
  const redoRoundScore = useGameStore((state) => state.redoRoundScore);

  const undoneRoundsScoresCount = useMemo(
    () => undoneRoundsScores.length,
    [undoneRoundsScores.length],
  );

  const isRedoDisabled = undoneRoundsScoresCount === 0;

  return (
    <ExtendedTooltip
      tooltipText={messages.redoRoundTitle}
      button={
        <Button
          variant="solid"
          action="secondary"
          onPress={redoRoundScore}
          disabled={isRedoDisabled}
          className={isRedoDisabled ? "cursor-not-allowed opacity-50" : ""}
        >
          <Icon as={Redo} />
        </Button>
      }
      tooltipTextClassName="text-md"
    />
  );
}
