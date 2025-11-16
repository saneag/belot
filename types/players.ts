export interface TeamMember {
  id: number;
}

export interface Player {
  id: number;
  name: string;
  isDealer: boolean;
  isRoundPlayer: boolean;
  teamMembers?: TeamMember;
}
