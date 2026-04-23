import { useCallback } from "react";

import { View } from "react-native";

import { useGameStore } from "@belot/store";
import { Player } from "@belot/types";

import { RoundPlayerDisplayProps } from "@/components/game-table/action-buttons/next-round-button/roundPlayerDisplay";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";

import { useLocalization } from "@/localizations/useLocalization";

export default function RoundPlayerSelect({
  setRoundPlayer,
}: Pick<RoundPlayerDisplayProps, "setRoundPlayer">) {
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
