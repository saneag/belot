import { GameMode, GameSlice, Player, PlayersSlice } from "@belot/types";
import { prepareTeams } from "@belot/utils";

import { StateCreator } from "zustand";

export const createPlayersSlice: StateCreator<PlayersSlice & Partial<GameSlice>> = (set) => ({
  players: [],
  teams: [],

  setPlayers: (players) =>
    set(() => {
      const mode: GameMode = players.length === 4 ? GameMode.teams : GameMode.classic;

      return { players, mode, teams: prepareTeams(players, mode) };
    }),
  setEmptyPlayersNames: (count) =>
    set(() => {
      const mode = count === 4 ? GameMode.teams : GameMode.classic;

      const emptyPlayers: Player[] = Array.from({ length: count }).map((_, index) => ({
        id: index,
        name: "",
        ...(mode === GameMode.teams && { teamId: index % 2 }),
      }));

      return {
        players: emptyPlayers,
        mode,
        teams: prepareTeams(emptyPlayers, mode),
      };
    }),
  updatePlayer: (playerId, player) =>
    set((state) => ({
      players: state.players.map((statePlayer) =>
        statePlayer.id === playerId ? { ...statePlayer, ...player } : statePlayer,
      ),
    })),
  shufflePlayers: () =>
    set((state) => {
      const shuffledPlayers = [...state.players];

      for (let i = shuffledPlayers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
      }

      return {
        players: shuffledPlayers,
      };
    }),
});
