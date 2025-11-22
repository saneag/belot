import { Dispatch, SetStateAction } from 'react';
import { NEXT_WINNING_STEP, WIN_POINTS } from '../../constants/gameConstants';
import { PlayersSlice } from '../../store/players.slice';
import { RoundSlice } from '../../store/rounds.slice';
import {
  GameMode,
  Player,
  PlayerScore,
  RoundScore,
  Team,
  TeamScore,
} from '../../types/game';

export const setNextDealer = (state: RoundSlice & Partial<PlayersSlice>) => {
  if (state.roundsScores.length === 0) {
    return {};
  }

  const players = state.players;

  if (!players || players.length === 0) {
    return {};
  }

  const currentDealerIndex = players.findIndex(
    (player) => player.id === state.dealer?.id
  );

  const nextDealerIndex =
    currentDealerIndex === -1 ? 0 : (currentDealerIndex + 1) % players.length;

  return {
    dealer: players[nextDealerIndex],
  };
};

export const getOpponentPlayersScore = (
  roundPlayer: Player | null,
  playersScores?: PlayerScore[]
) => {
  return playersScores?.filter(
    (playerScore) => playerScore.playerId !== roundPlayer?.id
  );
};

export const getOpponentTeamScore = (
  roundPlayer: Player | null,
  teamsScores?: TeamScore[]
) => {
  return teamsScores?.filter(
    (teamScore) => teamScore.teamId !== roundPlayer?.teamId
  );
};

const checkForPlayerWinner = (
  players: Player[],
  calculatedRoundScore: RoundScore,
  gameOverflowCount: number,
  setGameOverflowCount: Dispatch<SetStateAction<number>>
) => {
  const winner = calculatedRoundScore.playersScores.filter(
    (playerScore) =>
      playerScore.score >= WIN_POINTS + gameOverflowCount * NEXT_WINNING_STEP
  );

  if (winner.length > 1) {
    setGameOverflowCount((prev) => prev + 1);
    return null;
  }

  return players.find((player) => player.id === winner[0]?.playerId) ?? null;
};

const checkForTeamWinner = (
  teams: Team[],
  calculatedRoundScore: RoundScore,
  gameOverflowCount: number,
  setGameOverflowCount: Dispatch<SetStateAction<number>>
) => {
  const winner = calculatedRoundScore.teamsScores.filter(
    (teamScore) =>
      teamScore.totalScore >= WIN_POINTS + gameOverflowCount * NEXT_WINNING_STEP
  );

  if (winner.length > 1) {
    setGameOverflowCount((prev) => prev + 1);
    return null;
  }

  return teams.find((team) => team.id === winner[0]?.teamId) ?? null;
};

export const checkForGameWinner = (
  gameMode: GameMode,
  players: Player[],
  teams: Team[],
  calculatedRoundScore: RoundScore,
  gameOverflowCount: number,
  setGameOverflowCount: Dispatch<SetStateAction<number>>
) => {
  return gameMode === GameMode.classic
    ? checkForPlayerWinner(
        players,
        calculatedRoundScore,
        gameOverflowCount,
        setGameOverflowCount
      )
    : checkForTeamWinner(
        teams,
        calculatedRoundScore,
        gameOverflowCount,
        setGameOverflowCount
      );
};
