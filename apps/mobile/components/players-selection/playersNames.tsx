import { useMemo } from "react";

import { View } from "react-native";

import { PlayersNamesInputWrapper, PlayersTable } from "@belot/components";
import { useThemeContext } from "@belot/hooks";
import { useGameStore } from "@belot/store";
import { getPlayersCount } from "@belot/utils/src";

import PlayersNamesInput from "./playersNamesInput";
import PlayersRandomizer from "./playersRandomizer";

export default function PlayersNames() {
  const { theme } = useThemeContext();

  const players = useGameStore((state) => state.players);

  const playersCount = useMemo(() => getPlayersCount(players), [players]);

  return (
    <PlayersTable blockWrapper={View} isDarkMode={theme === "dark"}>
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
