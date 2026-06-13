import { useMemo } from "react";

import { useLocalizations } from "@belot/localizations";
import { useGameStore } from "@belot/store";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

import { Undo } from "lucide-react";

export default function UndoRoundButton() {
  const messages = useLocalizations([
    {
      key: "undo.round.title",
    },
  ]);

  const roundsScores = useGameStore((state) => state.roundsScores);
  const undoRoundScore = useGameStore((state) => state.undoRoundScore);

  const roundsScoresCount = useMemo(() => roundsScores.length, [roundsScores.length]);

  const isUndoDisabled = roundsScoresCount === 1;

  return (
    <Tooltip>
      <TooltipTrigger
        onClick={undoRoundScore}
        disabled={isUndoDisabled}
        className={cn(
          "bg-primary text-primary-foreground rounded-lg px-4 py-1",
          isUndoDisabled && "cursor-not-allowed opacity-50",
        )}
      >
        <Undo />
      </TooltipTrigger>
      <TooltipContent>
        <p>{messages.undoRoundTitle}</p>
      </TooltipContent>
    </Tooltip>
  );
}
