import { GameMode, Player, RoundScore, Team } from "./game";

export interface GameSlice {
  mode: GameMode;
  hasPreviousGame: boolean;

  setHasPreviousGame: (hasPreviousGame: boolean) => void;
}

export interface RoundSlice {
  dealer: Player | null;
  roundsScores: RoundScore[];
  undoneRoundsScores: RoundScore[];

  setDealer: (dealer: Player | null) => void;
  setRoundsScores: (roundsScores: RoundScore[]) => void;
  updateRoundScore: (roundScore: Partial<RoundScore>) => void;
  setEmptyRoundScore: () => void;
  skipRound: () => void;
  undoRoundScore: () => void;
  redoRoundScore: () => void;
}

export interface PlayersSlice {
  players: Player[];
  teams: Team[];

  setPlayers: (players: Player[]) => void;
  setEmptyPlayersNames: (count: number) => void;
  updatePlayer: (playerId: number, player: Partial<Omit<Player, "id">>) => void;
  shufflePlayers: () => void;
}
