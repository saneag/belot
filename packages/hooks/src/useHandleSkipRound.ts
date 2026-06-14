import { useCallback } from "react";

import { StorageKeys } from "@belot/constants";
import { useGameStore } from "@belot/store";
import { prepareEmptyRoundScoreRow, roundByLastDigit, setNextDealer } from "@belot/utils";

interface UseHandleSkipRoundProps {
  setItemsToStorage: (items: Partial<Record<StorageKeys, string>>) => Promise<void> | void;
}

export const useHandleSkipRound = ({ setItemsToStorage }: UseHandleSkipRoundProps) => {
  const players = useGameStore((state) => state.players);
  const teams = useGameStore((state) => state.teams);
  const mode = useGameStore((state) => state.mode);
  const roundsScores = useGameStore((state) =>
    Array.isArray(state.roundsScores) ? state.roundsScores : [],
  );
  const dealer = useGameStore((state) => state.dealer);
  const skipRound = useGameStore((state) => state.skipRound);

  return useCallback(async () => {
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

    const nextRoundsScores = [...updatedRoundsScores, newEmptyRow];
    const { dealer: nextDealer } = setNextDealer({
      players,
      roundsScores: nextRoundsScores,
      dealer,
    });

    const storageItems: Partial<Record<StorageKeys, string>> = {
      [StorageKeys.roundsScores]: JSON.stringify(nextRoundsScores),
    };

    if (nextDealer) {
      storageItems[StorageKeys.dealer] = JSON.stringify(nextDealer);
    }

    await setItemsToStorage(storageItems);
  }, [dealer, mode, players, roundsScores, setItemsToStorage, skipRound, teams]);
};
