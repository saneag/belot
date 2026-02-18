import { useCallback, useEffect } from "react";

import { useGameStore } from "@belot/store";
import { Player } from "@belot/types";

import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";

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
    <VStack className="gap-2.5">
      {players.map((player) => (
        <Button
          key={player.id}
          onPress={() => handleDealerChange(player)}
          variant={dealer?.id === player.id ? "solid" : "outline"}
          action="primary"
        >
          <ButtonText>{player.name}</ButtonText>
        </Button>
      ))}
    </VStack>
  );
}
