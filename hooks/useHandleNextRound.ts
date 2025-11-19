import { useCallback, useState } from 'react';
import { useGameStore } from '../store/game';
import { Player } from '../types/game';

export const useHandleNextRound = () => {
  const [roundPlayer, setRoundPlayer] = useState<Player | null>(null);

  const setStateRoundPlayer = useGameStore((state) => state.setRoundPlayer);

  const handleCancel = useCallback(() => {}, []);

  const handleNextRound = useCallback(() => {
    setStateRoundPlayer(roundPlayer);
  }, [roundPlayer, setStateRoundPlayer]);

  return {
    handleNextRound,
    handleCancel,
    roundPlayer,
    setRoundPlayer,
  };
};
