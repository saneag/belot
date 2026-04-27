import { useMemo } from "react";

import { useLocalizations } from "@belot/localizations";
import { useGameStore } from "@belot/store";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

  return (
    <Tooltip>
      <TooltipTrigger onClick={undoRoundScore} disabled={roundsScoresCount === 1}>
        <Undo />
      </TooltipTrigger>
      <TooltipContent>
        <p>{messages.undoRoundTitle}</p>
      </TooltipContent>
    </Tooltip>
  );
}
