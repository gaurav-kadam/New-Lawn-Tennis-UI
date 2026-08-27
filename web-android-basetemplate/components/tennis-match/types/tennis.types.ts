// TENNIS MATCH TYPES

export type PlayerId =
  | 'PLAYER1'
  | 'PLAYER2'
  | 'PLAYER3'
  | 'PLAYER4';


export type TeamId =
  | 'TEAM1'
  | 'TEAM2';


export type MatchType =
  | 'SINGLES'
  | 'DOUBLES';


export type MatchFormat =
  | 'BEST_OF_3'
  | 'BEST_OF_5';


export type PointValue =
  | '0'
  | '15'
  | '30'
  | '40'
  | 'AD';


export type SetScore = {
  player1Games: number;
  player2Games: number;

  wasTiebreak: boolean;

  tiebreakPlayer1Points?: number;
  tiebreakPlayer2Points?: number;
};


export type TennisEventType =
  | 'ACE'
  | 'FAULT'
  | 'DOUBLE_FAULT'
  | 'WINNER'
  | 'UNFORCED_ERROR'
  | 'VOLLEY'
  | 'SERVE'
  | 'POINT';



export type TennisAction = {
  type: TennisEventType;
  player: PlayerId;
};

export type TennisEventRecord = {
  id: string;
  type: TennisEventType;
  player: PlayerId;
  elapsedSeconds: number;
  recordedAt: number;
};


export type TennisMatchState = {

  matchType: MatchType;

  matchFormat: MatchFormat;

  player1Name: string;
  player2Name: string;

  player3Name: string;
  player4Name: string;

  server: PlayerId;


  serveNumber: 1 | 2;

doublesServeOrder: PlayerId[];

doublesServeIndex: number;
 
  player1Points: number;
  player2Points: number;


  isTiebreak: boolean;

  tiebreakPlayer1Points: number;
  tiebreakPlayer2Points: number;

  tiebreakServeCount: number;

  tiebreakFirstServer: PlayerId | null;


  player1Games: number;
  player2Games: number;

  completedSets: SetScore[];

  player1Sets: number;
  player2Sets: number;

  matchWinner: PlayerId | null;


  lastAction: TennisAction | null;

  history: TennisMatchState[];
};