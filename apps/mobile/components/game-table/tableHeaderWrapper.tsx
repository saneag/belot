import { useCallback, useMemo } from "react";

import { useGameStore } from "@belot/store";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

import useGetPlayersNamesWithScoreColumn from "@/hooks/game-table/useGetPlayersNamesWithScoreColumn";

export default function TableHeaderWrapper() {
  const { playersNamesWithScoreColumn, columnsCount } = useGetPlayersNamesWithScoreColumn();

  const dealer = useGameStore((state) => state.dealer);
  const roundScores = useGameStore((state) => state.roundsScores);
  const roundsCount = useMemo(() => roundScores.length, [roundScores.length]);

  const getDealerBackground = useCallback(
    (index: number) => {
      if (index === (dealer?.id || 0) % columnsCount) {
        return "bg-green-300 dark:bg-green-600";
      }

      return "bg-secondary-400";
    },
    [dealer, columnsCount],
  );

  return (
    <TableHeader>
      <TableRow className={`${roundsCount > 1 ? "border-b border-primary-500" : ""}`} style={{}}>
        {playersNamesWithScoreColumn.map((playerName, index) => (
          <TableHead
            key={index}
            className={`${getDealerBackground(index)} ${index !== 0 ? "border-l border-primary-500" : ""} p-0 text-center text-2xl`}
          >
            {playerName}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
