import { useCallback } from "react";

import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";
import { prepareEmptyRoundScoreRow, roundByLastDigit, setNextDealer } from "@belot/utils";

import ConfirmationDialog from "@/components/confirmationDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { useLocalizations } from "@/localizations/useLocalization";

import { ChevronsRight } from "lucide-react";

export default function SkipRoundButton() {
  const messages = useLocalizations([{ key: "skip.round.title" }, { key: "skip.round.content" }]);

  const players = useGameStore((state) => state.players);
  const teams = useGameStore((state) => state.teams);
  const mode = useGameStore((state) => state.mode);
  const roundsScores = useGameStore((state) => state.roundsScores);
  const dealer = useGameStore((state) => state.dealer);
  const skipRound = useGameStore((state) => state.skipRound);

  const handleAddEmptyRow = useCallback(() => {
    skipRound();

    const roundsScoresCount = roundsScores.length;

    if (roundsScoresCount === 0) return;

    const lastIndex = roundsScoresCount - 1;
    const lastRoundScore = roundsScores[lastIndex];

    const updatedRoundsScores = [...roundsScores];

    updatedRoundsScores[lastIndex] = {
      ...lastRoundScore,
      totalRoundScore: roundByLastDigit(lastRoundScore.totalRoundScore),
    };

    const newEmptyRow = prepareEmptyRoundScoreRow({
      players,
      teams,
      mode,
      roundsScores: updatedRoundsScores,
    });

    localStorage.setItem(
      StorageKeys.roundsScores,
      JSON.stringify([...updatedRoundsScores, newEmptyRow]),
    );

    const { dealer: nextDealer } = setNextDealer({
      players,
      roundsScores: [...updatedRoundsScores, newEmptyRow],
      dealer,
    });

    localStorage.setItem(StorageKeys.dealer, JSON.stringify(nextDealer));
  }, [skipRound, roundsScores, players, teams, mode, dealer]);

  return (
    <ConfirmationDialog
      title={messages.skipRoundTitle}
      content={messages.skipRoundContent}
      renderShowDialog={(showDialog) => (
        <Tooltip>
          <TooltipTrigger onClick={showDialog}>
            <ChevronsRight />
          </TooltipTrigger>
          <TooltipContent>
            <p>{messages.skipRoundTitle}</p>
          </TooltipContent>
        </Tooltip>
      )}
      confirmationCallback={handleAddEmptyRow}
    />
  );
}
