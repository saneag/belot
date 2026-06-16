import { useEffect, useRef } from "react";

interface UseSyncPlayerScoreInputParams {
  opponentId: number;
  totalRoundScore: number;
  targetScore: number;
  onScoreChange: (value: number) => void;
}

export const useSyncPlayerScoreInput = ({
  opponentId,
  totalRoundScore,
  targetScore,
  onScoreChange,
}: UseSyncPlayerScoreInputParams) => {
  const lastSyncedScoreRef = useRef<{
    opponentId: number;
    totalRoundScore: number;
    score: number;
  } | null>(null);

  useEffect(() => {
    if (!totalRoundScore) {
      lastSyncedScoreRef.current = null;
      return;
    }

    const lastSyncedScore = lastSyncedScoreRef.current;

    if (
      lastSyncedScore?.opponentId === opponentId &&
      lastSyncedScore.totalRoundScore === totalRoundScore &&
      lastSyncedScore.score === targetScore
    ) {
      return;
    }

    onScoreChange(targetScore);
    lastSyncedScoreRef.current = {
      opponentId,
      totalRoundScore,
      score: targetScore,
    };
  }, [opponentId, onScoreChange, targetScore, totalRoundScore]);
};
