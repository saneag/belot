import { useHandleDealerChange } from "@belot/hooks";

import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";

export default function DealerSelectDialogContent() {
  const { players, dealer, handleDealerChange } = useHandleDealerChange();

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
