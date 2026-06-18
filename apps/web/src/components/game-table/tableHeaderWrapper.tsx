import { useMemo } from "react";

import { useGetTableHeaderDealerBackground } from "@belot/hooks";
import { useGameStore } from "@belot/store";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

import useGetPlayersNamesWithScoreColumn from "@/hooks/game-table/useGetPlayersNamesWithScoreColumn";

export default function TableHeaderWrapper() {
  const { playersNamesWithScoreColumn, columnsCount } = useGetPlayersNamesWithScoreColumn();

  const { getDealerBackground } = useGetTableHeaderDealerBackground({
    columnsCount,
    color: "bg-success",
  });

  const roundScores = useGameStore((state) => state.roundsScores);
  const roundsCount = useMemo(() => roundScores.length, [roundScores.length]);

  return (
    <TableHeader className="bg-background sticky top-0 z-20">
      <TableRow
        className={`${roundsCount > 1 ? "border-primary border-b-[3px]!" : ""} bg-background flex flex-row`}
      >
        {playersNamesWithScoreColumn.map((playerName, index) => (
          <TableHead
            key={index}
            className={`${getDealerBackground(index)} ${index !== 0 ? "border-primary border-l" : ""} flex h-full flex-1 items-center justify-center p-0 text-2xl`}
            data-testid={`game-table-header-player-${playerName}`}
          >
            {playerName}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
