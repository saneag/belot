import { useMemo } from "react";

import { View } from "react-native";

import { useGameStore } from "@belot/store";
import { getPlayersCount } from "@belot/utils";

import { getRotation } from "@/helpers/playerNamesHelpers";

import { useGetInputPosition } from "../../hooks/players-selection/useGetInputPosition";
import PlayersNamesInput from "./playersNamesInput";
import PlayersRandomizer from "./playersRandomizer";
import PlayersTable from "./playersTable";

export default function PlayersNames() {
  const players = useGameStore((state) => state.players);

  const playersCount = useMemo(() => getPlayersCount(players), [players]);

  const { getRightPosition, getTopPosition } = useGetInputPosition();

  return (
    <PlayersTable>
      <PlayersRandomizer />
      {players.map((player, index) => (
        <View
          key={player.id}
          className="absolute"
          style={{
            top: getTopPosition(index, playersCount),
            right: getRightPosition(index, playersCount),
            transform: getRotation(index, playersCount),
          }}
        >
          <PlayersNamesInput player={player} />
        </View>
      ))}
    </PlayersTable>
  );
}
