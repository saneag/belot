import { create } from 'zustand';
import { getPlayersCount } from '../helpers/playerNamesHelpers';
import { Player } from '../types/players';

interface PlayersStoreValues {
  players: Player[];
  hasPreviousGame: boolean;
}

interface PlayersStoreFunctions {
  setPlayers: (players: Player[]) => void;
  updatePlayers: (
    playerId: Player['id'],
    playerData: Partial<Omit<Player, 'id'>>
  ) => void;
  setNextDealer: VoidFunction;
  setDealer: (playerId: Player['id']) => void;
  setRoundPlayer: (playerId: Player['id']) => void;
  setHasPreviousGame: (hasPreviousGame: boolean) => void;
  reset: VoidFunction;
}

interface PlayersStore extends PlayersStoreValues, PlayersStoreFunctions {}

export const usePlayersStore = create<PlayersStore>((set) => ({
  players: [],
  hasPreviousGame: false,
  setPlayers: (players: Player[]) => set(() => ({ players })),
  updatePlayers: (playerId, playerData) =>
    set((state) => {
      const player = state.players.find((player) => player.id === playerId);

      if (!player) {
        return {};
      }

      const updatePlayers: Player[] = state.players.map((statePlayer) => {
        if (statePlayer.id === player.id) {
          return {
            ...statePlayer,
            ...playerData,
          };
        }

        return {
          ...statePlayer,
        };
      });

      return {
        players: updatePlayers,
      };
    }),
  setNextDealer: () =>
    set((state) => {
      const currentDealerIndex = state.players.findIndex(
        (player) => player.isDealer
      );

      if (currentDealerIndex === -1) {
        return {};
      }

      const playersCount = getPlayersCount(state.players);
      const playerIndexToUpdate =
        currentDealerIndex + 1 === playersCount ? 0 : currentDealerIndex + 1;

      const updatedPlayers: Player[] = state.players.map((player, index) => {
        if (index === playerIndexToUpdate) {
          return {
            ...player,
            isDealer: true,
          };
        }

        return {
          ...player,
          isDealer: false,
        };
      });

      return {
        players: updatedPlayers,
      };
    }),
  setDealer: (playerId) =>
    set((state) => ({
      players: state.players.map((player) => ({
        ...player,
        isDealer: player.id === playerId,
      })),
    })),
  setRoundPlayer: () =>
    set((state) => ({
      players: state.players.map((player) => ({
        ...player,
        isRoundPlayer: false,
      })),
    })),
  setHasPreviousGame: (hasPreviousGame) => set(() => ({ hasPreviousGame })),
  reset: () =>
    set(() => ({
      players: [],
    })),
}));
