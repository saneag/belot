import { useCallback, useEffect, useMemo } from "react";

import { View } from "react-native";

import { useGameStore } from "@belot/store";
import { getPlayersCount } from "@belot/utils";

import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";

import { useLocalization } from "@/localizations/useLocalization";

import { usePlayersSelectionContext } from "./playersSelectionContext";

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
    <View className="gap-2.5">
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
    </View>
  );
}
