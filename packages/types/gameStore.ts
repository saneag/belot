import { GameMode, Player, RoundScore, Team } from "./game";

export interface GameSlice {
  mode: GameMode;
  hasPreviousGame: boolean;

  setHasPreviousGame: (hasPreviousGame: boolean) => void;
}

export interface RoundSlice {
  dealer: Player | null;
  roundPlayer: Player | null;
  roundsScores: RoundScore[];
  undoneRoundsScores: RoundScore[];

  setDealer: (dealer: Player | null) => void;
  setRoundPlayer: (roundPlayer: Player | null) => void;
  setRoundsScores: (roundsScores: RoundScore[]) => void;
  updateRoundScore: (roundScore: Partial<RoundScore>) => void;
  setEmptyRoundScore: VoidFunction;
  skipRound: VoidFunction;
  undoRoundScore: VoidFunction;
  redoRoundScore: VoidFunction;
}

export interface PlayersSlice {
  players: Player[];
  teams: Team[];

  setPlayers: (players: Player[]) => void;
  setEmptyPlayersNames: (count: number) => void;
  updatePlayer: (playerId: number, player: Partial<Omit<Player, "id">>) => void;
  shufflePlayers: () => void;
}
