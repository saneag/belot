import { PlayersSlice } from '../../store/players.slice';
import { RoundSlice } from '../../store/rounds.slice';
import { Player, PlayerScore, TeamScore } from '../../types/game';

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
