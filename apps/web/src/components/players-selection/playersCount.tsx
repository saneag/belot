import { PLAYERS_COUNT } from "@belot/constants";
import { usePlayersCount } from "@belot/hooks";

import { Button } from "@/components/ui/button";

import { useLocalization } from "@/localizations/useLocalization";

export default function PlayersCount() {
  const numberOfPlayersMsg = useLocalization("players.count.number.of.players");

  const { playersCount, handlePlayersCountChange } = usePlayersCount();

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
