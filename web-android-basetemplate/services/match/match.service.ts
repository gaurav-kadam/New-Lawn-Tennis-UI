import ApiService from '../api/api.service';

class MatchService {

  async getMatches() {
    return ApiService.get('/matches');
  }

  async getMatchesByTournament(tournamentCode: string) {
    return ApiService.get(`/matches/tournament/${tournamentCode}`);
  }

  async getMatchById(id: number) {
    return ApiService.get(`/matches/${id}`);
  }

  async createMatch(data: any) {
    const backendData = this.mapToBackend(data);
    return ApiService.post('/matches', backendData);
  }

  async updateMatch(id: number, data: any) {
    const backendData = this.mapToBackend(data);
    return ApiService.put(`/matches/${id}`, backendData);
  }

  async deleteMatch(id: number) {
    return ApiService.delete(`/matches/${id}`);
  }

  /**
   * Translates frontend form parameters (both camelCase and snake_case format)
   * to exact backend structural signature
   */
  private mapToBackend(data: any) {
    // Safely extract team values
    const whiteTeamId = data.white_team_id ?? data.whiteTeamId ?? data.white_team ?? data.whiteTeam ?? null;
    const blueTeamId = data.blue_team_id ?? data.blueTeamId ?? data.blue_team ?? data.blueTeam ?? null;

    return {
      tournament_code: data.tournament_code || data.tournamentId,
      match_date: data.match_date || data.matchDate,
      match_time: data.match_time || data.matchTime,
      court_no: String(data.court_no || data.courtNo || ''),
      match_no: String(data.match_no || data.matchNo || ''),
      age_category: data.age_category || data.ageCategory,
      gender: data.gender,

      // Mapped to raw team fields if backend expects text names alongside IDs
      white_team: data.white_team || data.whiteTeam || '',
      blue_team: data.blue_team || data.blueTeam || '',

      // Explicit numeric structure IDs
      white_team_id: whiteTeamId ? Number(whiteTeamId) : null,
      blue_team_id: blueTeamId ? Number(blueTeamId) : null,

      digital_scorer_id: data.digital_scorer_id || data.digitalScorer ? Number(data.digital_scorer_id || data.digitalScorer) : null,
      referee_1_id: data.referee_1_id || data.referee1 ? Number(data.referee_1_id || data.referee1) : null,
      referee_2_id: data.referee_2_id || data.referee2 ? Number(data.referee_2_id || data.referee2) : null,
      
      // 🌟 New official parameters synced to backend columns
      goaljudge_1_id: data.goaljudge_1_id || data.goaljudge1 ? Number(data.goaljudge_1_id || data.goaljudge1) : null,
      goaljudge_2_id: data.goaljudge_2_id || data.goaljudge2 ? Number(data.goaljudge_2_id || data.goaljudge2) : null,
      timekeeper_1_id: data.timekeeper_1_id || data.timekeeper1 ? Number(data.timekeeper_1_id || data.timekeeper1) : null,
      timekeeper_2_id: data.timekeeper_2_id || data.timekeeper2 ? Number(data.timekeeper_2_id || data.timekeeper2) : null,
    };
  }
}

export default new MatchService();