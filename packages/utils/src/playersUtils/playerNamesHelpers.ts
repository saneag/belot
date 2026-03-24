import { Player, Team } from "@belot/types";

export const getPlayersCount = (players: Player[]) => players.length;

export const getPlayersNames = (players: Player[]) => players.map((player) => player.name);

export const getTeamsNames = (teams: Team[]) => teams.map((team) => team.name);
