import { useMemo } from "react";

import { View } from "react-native";

import { PlayersNamesInputWrapper, PlayersTable } from "@belot/components";
import { useGameStore } from "@belot/store";
import { getPlayersCount } from "@belot/utils/src";

import { useColorModeContext } from "@/components/colorModeContext";

import PlayersNamesInput from "./playersNamesInput";
import PlayersRandomizer from "./playersRandomizer";

export default function PlayersNames() {
  const { colorMode } = useColorModeContext();

  const players = useGameStore((state) => state.players);

  const playersCount = useMemo(() => getPlayersCount(players), [players]);

  return (
    <PlayersTable blockWrapper={View} isDarkMode={colorMode === "dark"}>
      <PlayersRandomizer />
      {players.map((player, index) => (
        <PlayersNamesInputWrapper
          key={player.id}
          blockWrapper={View}
          index={index}
          playersCount={playersCount}
        >
          <PlayersNamesInput player={player} />
        </PlayersNamesInputWrapper>
      ))}
    </PlayersTable>
  );
}
