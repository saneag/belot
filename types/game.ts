import { Dispatch, SetStateAction } from 'react';

export type PlayersScore = Record<string, string>;
export type GameScore = Record<string, PlayersScore>;

export interface ValidateEnteredScoreProps {
  roundScore: PlayersScore;
  playersCount: number;
  setIsEmptyGame: Dispatch<SetStateAction<boolean>>;
  isTeamVsTeam: boolean;
}
