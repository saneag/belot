import { useMemo } from "react";

import { PlayersTable } from "@belot/components";
import { THEMES } from "@belot/constants";
import { useGetInputPosition } from "@belot/hooks";
import { useGameStore } from "@belot/store";
import { getPlayersCount } from "@belot/utils/src";

import { useThemeContext } from "@/components/themeContext";

import PlayersNamesInput from "./playersNamesInput";
import PlayersRandomizer from "./playersRandomizer";

export default function PlayersNames() {
  const { theme } = useThemeContext();

  const players = useGameStore((state) => state.players);

  const playersCount = useMemo(() => getPlayersCount(players), [players]);

  const { getRightPosition, getTopPosition, getRotation } = useGetInputPosition();

  return (
    <PlayersTable
      blockWrapper="div"
      mainBlockClassName="flex items-center justify-center"
      isDarkMode={theme === THEMES.dark}
    >
      <PlayersRandomizer />
      {players.map((player, index) => (
        <div
          key={player.id}
          className="absolute"
          style={{
            top: getTopPosition(index, playersCount),
            right: getRightPosition(index, playersCount),
            transform: getRotation(index, playersCount) as string,
          }}
        >
          <PlayersNamesInput player={player} />
        </div>
      ))}
    </PlayersTable>
  );
}
