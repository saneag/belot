import { useMemo } from "react";

import { useGameStore } from "@belot/store";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { useLocalizations } from "@/localizations/useLocalization";

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
    // <Tooltip
    //   tooltipText={messages.undoRoundTitle}
    //   button={
    //     <Button
    //       variant="solid"
    //       action="secondary"
    //       onPress={undoRoundScore}
    //       disabled={roundsScoresCount === 1}
    //     >
    //       <Icon as={Undo} />
    //     </Button>
    //   }
    //   tooltipTextClassName="text-md"
    // />
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
