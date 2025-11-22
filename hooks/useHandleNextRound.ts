import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { DEFAULT_ROUND_POINTS } from '../constants/gameConstants';
import {
  calculateRoundScore,
  checkForGameWinner,
} from '../helpers/gameScoreHelpers';
import { useGameStore } from '../store/game';
import { Player, RoundScore, Team } from '../types/game';

const defaultRoundScoreState: RoundScore = {
  id: 0,
  playersScores: [],
  teamsScores: [],
  totalRoundScore: DEFAULT_ROUND_POINTS,
};

interface UseHandleNextRoundProps {
  setWinner: Dispatch<SetStateAction<Player | Team | null>>;
}

export const useHandleNextRound = ({ setWinner }: UseHandleNextRoundProps) => {
  const [roundPlayer, setRoundPlayer] = useState<Player | null>(null);
  const [roundScore, setRoundScore] = useState<RoundScore>(
    defaultRoundScoreState
  );
  const [gameOverflowCount, setGameOverflowCount] = useState(0);

  const players = useGameStore((state) => state.players);
  const teams = useGameStore((state) => state.teams);
  const gameMode = useGameStore((state) => state.mode);
  const roundsScores = useGameStore((state) => state.roundsScores);
  const setStateRoundPlayer = useGameStore((state) => state.setRoundPlayer);
  const updateRoundScore = useGameStore((state) => state.updateRoundScore);

  const handleCancel = useCallback(() => {
    setRoundPlayer(null);
    setStateRoundPlayer(null);
  }, [setStateRoundPlayer]);

  const handleNextRound = useCallback(() => {
    setStateRoundPlayer(roundPlayer);
    const calculatedRoundScore = calculateRoundScore(roundScore, roundPlayer);
    updateRoundScore(calculatedRoundScore);

    setRoundPlayer(null);
    setRoundScore(defaultRoundScoreState);
    setStateRoundPlayer(null);

    setWinner(
      checkForGameWinner(
        gameMode,
        players,
        teams,
        calculatedRoundScore,
        gameOverflowCount,
        setGameOverflowCount
      )
    );
  }, [
    gameMode,
    gameOverflowCount,
    players,
    roundPlayer,
    roundScore,
    setStateRoundPlayer,
    setWinner,
    teams,
    updateRoundScore,
  ]);

  useEffect(() => {
    const lastRoundScores = roundsScores.at(-1);
    if (lastRoundScores) {
      setRoundScore(lastRoundScores);
    }
  }, [roundsScores]);

  return {
    handleNextRound,
    handleCancel,
    roundPlayer,
    setRoundPlayer,
    roundScore,
    setRoundScore,
  };
};
