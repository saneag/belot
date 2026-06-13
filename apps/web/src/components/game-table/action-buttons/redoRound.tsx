import { useMemo } from "react";

import { useLocalizations } from "@belot/localizations";
import { useGameStore } from "@belot/store";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

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

  const isRedoDisabled = undoneRoundsScoresCount === 0;

  return (
    <Tooltip>
      <TooltipTrigger
        onClick={redoRoundScore}
        disabled={isRedoDisabled}
        className={cn(
          "bg-primary text-primary-foreground rounded-lg px-4 py-1",
          isRedoDisabled && "cursor-not-allowed opacity-50",
        )}
      >
        <Redo />
      </TooltipTrigger>
      <TooltipContent>
        <p>{messages.redoRoundTitle}</p>
      </TooltipContent>
    </Tooltip>
  );
}
