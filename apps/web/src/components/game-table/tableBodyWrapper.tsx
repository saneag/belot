import { useMemo } from "react";

import { useGameStore } from "@belot/store";

import { TableBody, TableRow } from "@/components/ui/table";

import PointCells from "./pointCells";

export default function TableBodyWrapper() {
  const players = useGameStore((state) => state.players);
  const playersCount = useMemo(() => players.length, [players.length]);
  const roundsScores = useGameStore((state) => state.roundsScores);
  const gameMode = useGameStore((state) => state.mode);
  const roundsScoresCount = useMemo(() => roundsScores.length, [roundsScores.length]);

  return (
    <TableBody className="overflow-y-scroll">
      {roundsScores.map(
        (roundScore, index) =>
          index !== roundsScoresCount - 1 && (
            <TableRow
              key={roundScore.id}
              className={`${index > 0 && index % playersCount === 0 ? "border-t-2!" : ""} border-primary flex flex-row border-b`}
            >
              <PointCells roundScore={roundScore} gameMode={gameMode} />
            </TableRow>
          ),
      )}
    </TableBody>
  );
}
