import { useCallback, useState } from 'react';
import { DEFAULT_ROUND_POINTS } from '../constants/gameConstants';

export const useHandleNextRound = () => {
  const [inputValue, setInputValue] = useState('');
  const [roundScore, setRoundScore] = useState(String(DEFAULT_ROUND_POINTS));

  const handleCancel = useCallback(() => {}, []);

  const handleNextRound = useCallback(() => {}, []);

  return {
    handleNextRound,
    handleCancel,
    inputValue,
    setInputValue,
    roundScore,
    setRoundScore,
  };
};
