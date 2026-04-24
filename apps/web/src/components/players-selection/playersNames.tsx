import { useMemo } from "react";

import { PlayersNamesInputWrapper, PlayersTable } from "@belot/components";
import { THEMES } from "@belot/constants";
import { useGameStore } from "@belot/store";
import { getPlayersCount } from "@belot/utils/src";

import { useThemeContext } from "@/components/themeContext";

import PlayersNamesInput from "./playersNamesInput";
import PlayersRandomizer from "./playersRandomizer";

export default function PlayersNames() {
  const { theme } = useThemeContext();

  const players = useGameStore((state) => state.players);

  const playersCount = useMemo(() => getPlayersCount(players), [players]);

  return (
    <PlayersTable blockWrapper="div" isDarkMode={theme === THEMES.dark}>
      <PlayersRandomizer />
      {players.map((player, index) => (
        <PlayersNamesInputWrapper
          key={player.id}
          blockWrapper="div"
          index={index}
          playersCount={playersCount}
        >
          <PlayersNamesInput player={player} />
        </PlayersNamesInputWrapper>
      ))}
    </PlayersTable>
  );
}
