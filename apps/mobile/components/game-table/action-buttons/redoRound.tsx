import { useMemo } from "react";

import { useGameStore } from "@belot/store";

import ExtendedTooltip from "@/components/extendedTooltip";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

import { useLocalizations } from "@/localizations/useLocalization";

import { Redo } from "lucide-react-native";

export default function RedoRoundButton() {
  const messages = useLocalizations([
    {
      key: "redo.round.title",
    },
  ]);

  const undoneRoundsScores = useGameStore((state) => state.undoneRoundsScores);
  const redoRoundScore = useGameStore((state) => state.redoRoundScore);

  const undoneRoundsScoresCount = useMemo(
    () => undoneRoundsScores.length,
    [undoneRoundsScores.length],
  );

  return (
    <ExtendedTooltip
      tooltipText={messages.redoRoundTitle}
      button={
        <Button
          variant="solid"
          action="secondary"
          onPress={redoRoundScore}
          disabled={undoneRoundsScoresCount === 0}
        >
          <Icon as={Redo} />
        </Button>
      }
      tooltipTextClassName="text-md"
    />
  );
}
