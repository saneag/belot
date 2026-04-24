import { useMemo } from "react";

import { useGetInputPosition } from "@belot/hooks";
import { useGameStore } from "@belot/store";
import { getPlayersCount } from "@belot/utils/src";

import PlayersNamesInput from "./playersNamesInput";
import PlayersRandomizer from "./playersRandomizer";
import PlayersTable from "./playersTable";

export default function PlayersNames() {
  const players = useGameStore((state) => state.players);

  const playersCount = useMemo(() => getPlayersCount(players), [players]);

  const { getRightPosition, getTopPosition, getRotation } = useGetInputPosition();

  return (
    <PlayersTable>
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
