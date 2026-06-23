import { useGameStore } from "@belot/store";

export const useMaxScoreSelection = () => {
  const maxScore = useGameStore((state) => state.maxScore);
  const setMaxScore = useGameStore((state) => state.setMaxScore);

  return { maxScore, handleMaxScoreChange: setMaxScore };
};
