import { StateCreator } from 'zustand';
import { prepareTeams } from '../helpers/gameScoreHelpers';
import { GameMode, Player, Team } from '../types/game';
import { GameSlice } from './game.slice';

export interface PlayersSlice {
  players: Player[];
  teams: Team[];

  setPlayers: (players: Player[]) => void;
  setEmptyPlayersNames: (count: number) => void;
  updatePlayer: (playerId: number, player: Partial<Omit<Player, 'id'>>) => void;
}

export const createPlayersSlice: StateCreator<
  PlayersSlice & Partial<GameSlice>
> = (set) => ({
  players: [],
  teams: [],

  setPlayers: (players) =>
    set(() => {
      const mode: GameMode = players.length === 4 ? 'team' : 'classic';

      return { players, mode, teams: prepareTeams(players, mode) };
    }),
  setEmptyPlayersNames: (count) =>
    set(() => {
      const mode = count === 4 ? 'team' : 'classic';

      const emptyPlayers: Player[] = Array.from({ length: count }).map(
        (_, index) => ({
          id: index,
          name: '',
          ...(mode === 'team' && { teamId: index % 2 }),
        })
      );

      return {
        players: emptyPlayers,
        mode,
        teams: prepareTeams(emptyPlayers, mode),
      };
    }),
  updatePlayer: (playerId, player) =>
    set((state) => ({
      players: state.players.map((statePlayer) =>
        statePlayer.id === playerId
          ? { ...statePlayer, ...player }
          : statePlayer
      ),
    })),
});
