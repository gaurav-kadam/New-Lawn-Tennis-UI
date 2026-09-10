import ApiService from '../api/api.service';

export type FinalMatchEvent = {
  event_number: number;
  event_type:
    | 'POINT'
    | 'ACE'
    | 'FAULT'
    | 'DOUBLE_FAULT'
    | 'SERVE'
    | 'WINNER'
    | 'UNFORCED_ERROR'
    | 'VOLLEY';
  player: 'PLAYER1' | 'PLAYER2' | 'PLAYER3' | 'PLAYER4';
  server?: 'PLAYER1' | 'PLAYER2' | 'PLAYER3' | 'PLAYER4';
  elapsed_seconds: number;
  recorded_at: string;
};

export type FinalizeMatchPayload = {
  final_state: {
    player1_points: number;
    player2_points: number;
    player1_games: number;
    player2_games: number;
    player1_sets: number;
    player2_sets: number;
    is_tiebreak: boolean;
    tiebreak_player1_points: number;
    tiebreak_player2_points: number;
    match_winner: 'PLAYER1' | 'PLAYER2';
    completed_sets: Array<{
      player1_games: number;
      player2_games: number;
      was_tiebreak: boolean;
      tiebreak_player1_points?: number;
      tiebreak_player2_points?: number;
      serving_state?: Record<string, unknown>;
    }>;
    serving_state?: Record<string, unknown>;
  };
  events: FinalMatchEvent[];
};

class MatchFinalizationService {
  finalize(
    matchId: string,
    payload: FinalizeMatchPayload
  ) {
    return ApiService.post(
      `/matches/${matchId}/finalize`,
      payload
    );
  }
  getEvents(matchId: string) {
  return ApiService.get(
    `/matches/${matchId}/events`
  );
}
}

export default new MatchFinalizationService();
