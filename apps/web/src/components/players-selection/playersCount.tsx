import { useCallback, useEffect, useMemo } from "react";

import { usePlayersSelectionContext } from "@belot/hooks";
import { useGameStore } from "@belot/store";
import { getPlayersCount } from "@belot/utils/src";

import { Button } from "@/components/ui/button";

import { useLocalization } from "@/localizations/useLocalization";

const PLAYERS_COUNT = [3, 4];

export default function PlayersCount() {
  const numberOfPlayersMsg = useLocalization("players.count.number.of.players");

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

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-center text-lg">{numberOfPlayersMsg}</span>
      <div className="flex justify-center gap-2.5">
        {PLAYERS_COUNT.map((count) => (
          <Button
            key={count}
            variant={playersCount === count ? "default" : "outline"}
            className="px-4"
            onClick={() => handlePlayersCountChange(count)}
          >
            {count}
          </Button>
        ))}
      </div>
    </div>
  );
}
