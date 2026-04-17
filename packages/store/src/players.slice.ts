import { GameMode, type GameSlice, type Player, type PlayersSlice } from "@belot/types";
import { prepareTeams } from "@belot/utils/src";

import { type StateCreator } from "zustand";

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
      const players = [...state.players];

      const names = players.map((player) => player.name);

      for (let i = names.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [names[i], names[j]] = [names[j], names[i]];
      }

      const updatedPlayers = players.map((player, index) => ({
        ...player,
        name: names[index],
      }));

      return {
        players: updatedPlayers,
      };
    }),
});
