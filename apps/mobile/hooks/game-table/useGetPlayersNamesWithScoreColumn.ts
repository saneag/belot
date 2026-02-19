import { useMemo } from "react";

import { useGameStore } from "@belot/store";
import { GameMode } from "@belot/types";
import { getPlayersNames, getTeamsNames } from "@belot/utils";

import { useLocalization } from "@/localizations/useLocalization";

export default function useGetPlayersNamesWithScoreColumn() {
  const scoreMsg = useLocalization("score");

  const players = useGameStore((state) => state.players);
  const mode = useGameStore((state) => state.mode);
  const playersNames = useMemo(() => getPlayersNames(players), [players]);
  const teams = useGameStore((state) => state.teams);
  const teamsNames = useMemo(() => getTeamsNames(teams), [teams]);

  const filteredPlayerNames = useMemo(
    () => (mode === GameMode.classic ? playersNames : teamsNames),
    [mode, playersNames, teamsNames],
  );

  const playersNamesWithScoreColumn = useMemo(
    () => [...filteredPlayerNames, scoreMsg],
    [filteredPlayerNames, scoreMsg],
  );

  const columnsCount = useMemo(() => filteredPlayerNames.length, [filteredPlayerNames.length]);

  return { playersNamesWithScoreColumn, columnsCount };
}
