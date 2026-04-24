import { useMemo } from "react";

import { TransformsStyle, View } from "react-native";

import { PlayersTable } from "@belot/components";
import { useGetInputPosition } from "@belot/hooks";
import { useGameStore } from "@belot/store";
import { getPlayersCount } from "@belot/utils/src";

import { useColorModeContext } from "@/components/colorModeContext";

import PlayersNamesInput from "./playersNamesInput";
import PlayersRandomizer from "./playersRandomizer";

export default function PlayersNames() {
  const { colorMode } = useColorModeContext();

  const players = useGameStore((state) => state.players);

  const playersCount = useMemo(() => getPlayersCount(players), [players]);

  const { getRightPosition, getTopPosition, getRotation } = useGetInputPosition();

  return (
    <PlayersTable blockWrapper={View} isDarkMode={colorMode === "dark"}>
      <PlayersRandomizer />
      {players.map((player, index) => (
        <View
          key={player.id}
          className="absolute"
          style={{
            top: getTopPosition(index, playersCount),
            right: getRightPosition(index, playersCount),
            transform: getRotation(index, playersCount) as TransformsStyle["transform"],
          }}
        >
          <PlayersNamesInput player={player} />
        </View>
      ))}
    </PlayersTable>
  );
}
