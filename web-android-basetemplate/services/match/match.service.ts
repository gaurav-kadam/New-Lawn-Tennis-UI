import ApiService from '../api/api.service';

class MatchService {

  async getMatches(params?: Record<string, any>) {
    return ApiService.get('/matches', params);
  }

  async getMatchesByTournament(tournamentCode: string, params?: Record<string, any>) {
    return ApiService.get(`/matches/tournament/${tournamentCode}`, params);
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

  // 🌟 NEW METHOD: Hit the backend endpoint to change completion status
  async completeMatch(id: number | string) {
    return ApiService.post(`/matches/${id}/complete`,{});
  }

  private mapToBackend(data: any) {
    const whiteTeamCode = data.team1_code ?? null;
    const blueTeamCode = data.team2_code ?? null;

    const digitalScorer = data.digital_scorer_code ?? null;
    const referee1 = data.referee_1_code ?? null;
    const referee2 = data.referee_2_code ?? null;

    return {
      tournament_code: data.tournament_code || null,
      match_date: data.match_date || '',
      match_time: data.match_time || '',
      court_no: String(data.court_no || ''),
      match_no: String(data.match_no || ''),
      age_category: data.age_category || '',
      gender: data.gender,

      team1: data.team1 || '',
      team2: data.team2 || '',

      team1_code: whiteTeamCode ? String(whiteTeamCode) : null,
      team2_code: blueTeamCode ? String(blueTeamCode) : null,

      digital_scorer_code: digitalScorer ? String(digitalScorer) : null,
      referee_1_code: referee1 ? String(referee1) : null,
      referee_2_code: referee2 ? String(referee2) : null,
      
      goaljudge_1_code: data.goaljudge_1_code || null,
      goaljudge_2_code: data.goaljudge_2_code || null,
      timekeeper_1_code: data.timekeeper_1_code || null,
      timekeeper_2_code: data.timekeeper_2_code || null,
      quarter_duration: data.quarter_duration != null ? Number(data.quarter_duration) : null,
      // Pass along status directly if supplied in custom forms
      is_complete: data.is_complete ?? false,
    };
  }
}

export default new MatchService();

