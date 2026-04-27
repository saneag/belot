import { useCallback, useEffect } from "react";

import { useGameStore } from "@belot/store";
import type { Player } from "@belot/types";

export const useHandleDealerChange = () => {
  const players = useGameStore((state) => state.players);
  const dealer = useGameStore((state) => state.dealer);
  const setDealer = useGameStore((state) => state.setDealer);

  const handleDealerChange = useCallback(
    (dealer: Player) => {
      setDealer(dealer);
    },
    [setDealer],
  );

  useEffect(() => {
    if (!dealer && players.length) {
      setDealer(players[0]);
    }
  }, [dealer, players, setDealer]);

  return { players, dealer, handleDealerChange };
};
