import { useCallback, useEffect, useMemo } from "react";

import { PLAYERS_COUNT } from "@belot/constants";
import { useGameStore } from "@belot/store";
import { getPlayersCount } from "@belot/utils";

import { usePlayersSelectionContext } from "./usePlayersSelectionContext";

export const usePlayersCount = () => {
  const { resetValidations } = usePlayersSelectionContext();

  const players = useGameStore((state) => state.players);
  const setEmptyPlayersNames = useGameStore((state) => state.setEmptyPlayersNames);

  const playersCount = useMemo(() => getPlayersCount(players), [players]);

  const handlePlayersCountChange = useCallback(
    (count: number) => {
      setEmptyPlayersNames(count);
      resetValidations();
    },
    [resetValidations, setEmptyPlayersNames],
  );

  useEffect(() => {
    if (playersCount === 0) {
      setEmptyPlayersNames(PLAYERS_COUNT[0]);
    }
  }, [playersCount, setEmptyPlayersNames]);

  return {
    playersCount,
    handlePlayersCountChange,
  };
};
