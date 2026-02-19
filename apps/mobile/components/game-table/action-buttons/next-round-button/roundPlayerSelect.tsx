import { Dispatch, SetStateAction, useCallback } from "react";

import { View } from "react-native";

import { useGameStore } from "@belot/store";
import { Player } from "@belot/types";

import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";

import { useLocalization } from "@/localizations/useLocalization";

export interface RoundPlayerSelectProps {
  roundPlayer: Player | null;
  setRoundPlayer: Dispatch<SetStateAction<Player | null>>;
}

export default function RoundPlayerSelect({ setRoundPlayer }: RoundPlayerSelectProps) {
  const nextRoundPlayerMsg = useLocalization("next.round.player.select");

  const players = useGameStore((state) => state.players);

  const handleRoundPlayerChange = useCallback(
    (player: Player) => {
      setRoundPlayer(player);
    },
    [setRoundPlayer],
  );

  return (
    <View className="gap-2.5">
      <Text>{nextRoundPlayerMsg}</Text>
      <HStack className="flex-wrap justify-center gap-2.5">
        {players.map((player) => (
          <Button key={player.id} variant="outline" onPress={() => handleRoundPlayerChange(player)}>
            <ButtonText>{player.name}</ButtonText>
          </Button>
        ))}
      </HStack>
    </View>
  );
}
