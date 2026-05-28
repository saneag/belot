import { useMemo } from "react";

import { useGetTableHeaderDealerBackground } from "@belot/hooks";
import { useGameStore } from "@belot/store";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

import useGetPlayersNamesWithScoreColumn from "@/hooks/game-table/useGetPlayersNamesWithScoreColumn";

export default function TableHeaderWrapper() {
  const { playersNamesWithScoreColumn, columnsCount } = useGetPlayersNamesWithScoreColumn();

  const { getDealerBackground } = useGetTableHeaderDealerBackground({
    columnsCount,
    color: "bg-success-500",
  });

  const roundScores = useGameStore((state) =>
    Array.isArray(state.roundsScores) ? state.roundsScores : [],
  );
  const roundsCount = useMemo(() => roundScores.length, [roundScores.length]);

  return (
    <TableHeader>
      <TableRow
        className={`${roundsCount > 1 ? "border-primary-500" : ""}`}
        style={{
          borderBottomWidth: roundsCount > 1 ? 2 : 1,
        }}
      >
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
