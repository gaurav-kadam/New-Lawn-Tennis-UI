export type SessionResult = {
  session: number;
  redScore: number;
  blueScore: number;
};

export type MatchWinner =
  | 'RED'
  | 'BLUE'
  | 'DRAW';