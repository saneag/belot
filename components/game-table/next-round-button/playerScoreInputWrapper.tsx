import { Dispatch, SetStateAction, useMemo } from 'react';
import {
  getOpponentPlayersScore,
  getOpponentTeamScore,
} from '../../../helpers/gameScoreHelpers';
import { useGameStore } from '../../../store/game';
import { Player, RoundScore } from '../../../types/game';
import PlayerScoreInput from './playerScoreInput';

interface PlayerScoreInputWrapperProps {
  roundScore: RoundScore;
  setRoundScore: Dispatch<SetStateAction<RoundScore>>;
  roundPlayer: Player | null;
}

export default function PlayerScoreInputWrapper({
  roundScore,
  setRoundScore,
  roundPlayer,
}: PlayerScoreInputWrapperProps) {
  const roundsScores = useGameStore((state) => state.roundsScores);
  const gameMode = useGameStore((state) => state.mode);

  const lastRoundScore = useMemo(() => roundsScores.at(-1), [roundsScores]);
  const opponents = useMemo(
    () =>
      gameMode === 'classic'
        ? getOpponentPlayersScore(roundPlayer, lastRoundScore?.playersScores)
        : getOpponentTeamScore(roundPlayer, lastRoundScore?.teamsScores),
    [
      gameMode,
      lastRoundScore?.playersScores,
      lastRoundScore?.teamsScores,
      roundPlayer,
    ]
  );

  return opponents?.map((opponent) => (
    <PlayerScoreInput
      key={opponent.id}
      opponent={opponent}
      roundScore={roundScore}
      setRoundScore={setRoundScore}
      gameMode={gameMode}
    />
  ));
}
