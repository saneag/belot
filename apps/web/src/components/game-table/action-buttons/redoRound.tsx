import { useMemo } from "react";

import { useGameStore } from "@belot/store";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { useLocalizations } from "@/localizations/useLocalization";

import { Redo } from "lucide-react";

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
    <Tooltip>
      <TooltipTrigger onClick={redoRoundScore} disabled={undoneRoundsScoresCount === 0}>
        <Redo />
      </TooltipTrigger>
      <TooltipContent>
        <p>{messages.redoRoundTitle}</p>
      </TooltipContent>
    </Tooltip>
  );
}
