import type {
  PlayerId, TeamId, SetScore, ServingStateSnapshot, TennisEventRecord, TennisMatchState,
} from '@/components/tennis-match/types/tennis.types';

export type ScoreSheetData = {
  recording: ScoreSheetRecording;
  certification: 'NON_CERTIFIED';
  matchId: string;
  matchNumber: string | null;
  metadata: {
    event: string | null;
    ageCategory: string | null;
    gender: string | null;
    tournamentCode: string | null;
    tournamentName: null;
    round: string | null;
    court: string | null;
    scheduledDate: string | null;
  };
  matchType: TennisMatchState['matchType'];
  matchFormat: TennisMatchState['matchFormat'];
  participants: { slot: PlayerId; side: TeamId; name: string; country: null }[];
  winnerSide: TeamId;
  completedSets: SetScore[];
  
  events: TennisEventRecord[];
  serving: {
    currentServer: PlayerId;
    serviceOrder: PlayerId[];

    snapshot: Partial<ServingStateSnapshot> | null;
    courtEnd: null;
    doublesReceivers: null;
  };
  timing: {
    scheduledTime: string | null;
    calledAt: null;
    startedAt: null;
    finishedAt: null;
    durationSeconds: null;

    maxRecordedElapsedSeconds: number | null;
  };
  officials: {
    digitalScorerId: number | null;
    referee1Id: number | null;
    referee2Id: number | null;
    umpireId: number | null;
    supervisor: null;
    chairUmpire: null;
    netUmpire: null;
    lineUmpires: null;
  };
  ballChanges: null;
  signatures: null;
};

export type RecordedPoint<Winner extends PlayerId | TeamId = PlayerId, Server extends PlayerId | null = PlayerId> = {
  number: number;
  /** Player 1–Player 2 display order; GAME is labelled with winner at presentation. */
  scoreAfterPoint: string;
  winner: Winner;
  server: Server;
  eventNumber: number;
  event: TennisEventRecord;
};

export type RecordedGame<Winner extends PlayerId | TeamId = PlayerId, Server extends PlayerId | null = PlayerId> = {
  number: number;
  /** First server for a tie-break; each point retains its own server. */
  server: Server;
  isTiebreak: boolean;
  points: RecordedPoint<Winner, Server>[];
  winner: Winner;
};

export type RecordedSet<Winner extends PlayerId | TeamId = PlayerId, Server extends PlayerId | null = PlayerId> = {
  number: number;
  score: SetScore;
  games: RecordedGame<Winner, Server>[];
};

export type ScoreSheetRecording =
  | { status: 'VALIDATED'; matchType?: 'SINGLES'; sets: RecordedSet[]; eventCount: number; pointCount: number }
  | { status: 'VALIDATED'; matchType: 'DOUBLES'; sets: RecordedSet<TeamId, PlayerId | null>[]; eventCount: number; pointCount: number }
  | { status: 'PARTIAL'; matchType: 'DOUBLES'; sets: RecordedSet<TeamId, PlayerId | null>[]; eventCount: number; pointCount: number; limitations: string[] }
  | { status: 'UNAVAILABLE' | 'INCONSISTENT'; reason: string };
