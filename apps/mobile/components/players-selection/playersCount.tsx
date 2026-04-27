import { PLAYERS_COUNT } from "@belot/constants";
import { usePlayersCount } from "@belot/hooks";
import { useLocalization } from "@belot/localizations";

import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default function PlayersCount() {
  const numberOfPlayersMsg = useLocalization("players.count.number.of.players");

  const { playersCount, handlePlayersCountChange } = usePlayersCount();

  return (
    <VStack space="md">
      <Text className="text-center text-lg">{numberOfPlayersMsg}</Text>
      <HStack className="justify-center gap-2.5">
        {PLAYERS_COUNT.map((count) => (
          <Button
            key={count}
            variant={playersCount === count ? "solid" : "outline"}
            action="primary"
            onPress={() => handlePlayersCountChange(count)}
          >
            <ButtonText>{count}</ButtonText>
          </Button>
        ))}
      </HStack>
    </VStack>
  );
}
