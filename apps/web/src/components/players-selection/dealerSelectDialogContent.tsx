import { useCallback, useEffect } from "react";

import { useGameStore } from "@belot/store";
import { type Player } from "@belot/types";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export default function DealerSelectDialogContent() {
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

  return (
    <div className="flex justify-center gap-2.5">
      {players.map((player) => (
        <Button
          key={player.id}
          onClick={() => handleDealerChange(player)}
          variant="outline"
          className={cn(
            dealer?.id === player.id ? "bg-green-500! text-black hover:text-black" : "",
            "w-fit px-4",
          )}
          type="button"
        >
          {player.name}
        </Button>
      ))}
    </div>
  );
}
