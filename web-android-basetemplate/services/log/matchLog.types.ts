// services/matchLogs/matchLog.types.ts

export interface MatchLogPayload {
  match_id: number;
  quarter: number;
  time: string;
  team: 'White' | 'Blue';
  type: string;
  player: string;
  assist: string;
  scoreAtEvent?: string;
}

export interface BackendLogResponse {
  id: number;
  match_id: number;
  quarter: number;
  time: string;
  team: 'White' | 'Blue';
  type: string;
  player: string;
  assist: string;
  created_at?: string;
}