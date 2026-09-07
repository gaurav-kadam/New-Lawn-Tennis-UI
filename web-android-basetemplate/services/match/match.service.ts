import ApiService from '../api/api.service';

export type MatchPayload = {
  tournament_code: string;

  match_date: string;
  match_time: string;

  court_no: string;
  match_no: string;

  age_category: string;
  gender: string;

  match_type: 'SINGLES' | 'DOUBLES';
  match_format: 'BEST_OF_3' | 'BEST_OF_5';

  team1: string;
  team2: string;

  team1_code: string;
  team2_code: string;

  player1: string;
  player2: string;
  player3?: string | null;
  player4?: string | null;

  // IMPORTANT:
  // Backend requires player names
  player1_name: string;
  player2_name: string;
  player3_name?: string | null;
  player4_name?: string | null;

  digital_scorer_id: number | null;
  referee_1_id: number | null;
  referee_2_id: number | null;

  is_active: boolean;
  is_complete: boolean;

  // Optional fields used by tennis
  round?: string | null;
  service_order?: string[];
};

class MatchService {
  async getMatches(
    params?: Record<string, any>
  ) {
    return ApiService.get(
      '/matches',
      params
    );
  }

  async getMatchesByTournament(
    tournamentCode: string,
    params?: Record<string, any>
  ) {
    return ApiService.get(
      `/matches/tournament/${tournamentCode}`,
      params
    );
  }

  async getMatchById(
    id: number | string
  ) {
    return ApiService.get(
      `/matches/${id}`
    );
  }

  async createMatch(
    data: MatchPayload
  ) {
    const payload = this.mapToBackend(data);

    console.log(
      '========== MATCH CREATE REQUEST =========='
    );

    console.log(
      JSON.stringify(payload, null, 2)
    );

    return ApiService.post(
      '/matches',
      payload
    );
  }

  async updateMatch(
    id: number | string,
    data: MatchPayload
  ) {
    return ApiService.put(
      `/matches/${id}`,
      this.mapToBackend(data)
    );
  }

  async deleteMatch(
    id: number | string
  ) {
    return ApiService.delete(
      `/matches/${id}`
    );
  }

  async completeMatch(
    id: number | string
  ) {
    return ApiService.post(
      `/matches/${id}/complete`,
      {}
    );
  }

  private mapToBackend(
    data: MatchPayload
  ) {
    const isDoubles =
      data.match_type === 'DOUBLES';

    return {
      // =====================================================
      // TOURNAMENT
      // =====================================================

      tournament_code:
        data.tournament_code,

      // =====================================================
      // SCHEDULE
      // =====================================================

      match_date:
        data.match_date,

      match_time:
        data.match_time,

      court_no:
        String(data.court_no),

      match_no:
        String(data.match_no),

      // =====================================================
      // MATCH CONFIGURATION
      // =====================================================

      age_category:
        data.age_category,

      gender:
        data.gender,

      match_type:
        data.match_type,

      match_format:
        data.match_format,

      round:
        data.round || null,

      // =====================================================
      // TEAMS
      // =====================================================

      team1:
        data.team1,

      team2:
        data.team2,

      team1_code:
        data.team1_code,

      team2_code:
        data.team2_code,

      // =====================================================
      // PLAYERS
      // =====================================================

      // Player 1 is required for both singles and doubles
      player1:
        data.player1 || null,

      // IMPORTANT:
      // Player 2 is required for singles AND doubles
      player2:
        data.player2 || null,

      // Player 3 and 4 are only used for doubles
      player3:
        isDoubles
          ? data.player3 || null
          : null,

      player4:
        isDoubles
          ? data.player4 || null
          : null,

      // =====================================================
      // PLAYER NAMES
      // =====================================================

      // Backend explicitly requires these
      player1_name:
        data.player1_name,

      player2_name:
        data.player2_name,

      player3_name:
        isDoubles
          ? data.player3_name || null
          : null,

      player4_name:
        isDoubles
          ? data.player4_name || null
          : null,

      // =====================================================
      // DOUBLES SERVICE ORDER
      // =====================================================

      service_order:
        isDoubles
          ? data.service_order || []
          : [],

      // =====================================================
      // OFFICIALS
      // =====================================================

      digital_scorer_id:
        data.digital_scorer_id || null,
          
      referee_1_id:
        data.referee_1_id || null,
          
      referee_2_id:
        data.referee_2_id || null,
          
      // =====================================================
      // STATUS
      // =====================================================

      is_active:
        data.is_active,

      is_complete:
        data.is_complete,
    };
  }
}

export default new MatchService();