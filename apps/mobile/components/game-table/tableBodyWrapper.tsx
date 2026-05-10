import { useEffect, useMemo, useRef } from "react";

import { ScrollView } from "react-native";

import { useGameStore } from "@belot/store";

import { TableBody, TableRow } from "@/components/ui/table";

import PointCells from "./pointCells";

export default function TableBodyWrapper() {
  const players = useGameStore((state) => state.players);
  const playersCount = useMemo(() => players.length, [players.length]);
  const roundsScores = useGameStore((state) => state.roundsScores);
  const gameMode = useGameStore((state) => state.mode);
  const scrollViewRef = useRef<ScrollView>(null);
  const roundsScoresCount = useMemo(() => roundsScores.length, [roundsScores.length]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [roundsScores]);

  return (
    <ScrollView ref={scrollViewRef}>
      <TableBody>
        {roundsScores.map(
          (roundScore, index) =>
            index !== roundsScoresCount - 1 && (
              <TableRow
                key={roundScore.id}
                className="flex flex-row border-b border-primary-500"
                style={{
                  borderTopWidth: index > 0 && index % playersCount === 0 ? 2 : 1,
                }}
              >
                <PointCells roundScore={roundScore} gameMode={gameMode} />
              </TableRow>
            ),
        )}
      </TableBody>
    </ScrollView>
  );
}
