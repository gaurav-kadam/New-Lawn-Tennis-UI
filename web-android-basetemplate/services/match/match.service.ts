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

  // 🌟 NEW METHOD: Hit the backend endpoint to change completion status
  async completeMatch(id: number | string) {
    return ApiService.post(`/matches/${id}/complete`);
  }

  private mapToBackend(data: any) {
    const whiteTeamCode = data.white_team_code ?? data.whiteTeamCode ?? data.white_team_id ?? data.whiteTeamId ?? null;
    const blueTeamCode = data.blue_team_code ?? data.blueTeamCode ?? data.blue_team_id ?? data.blueTeamId ?? null;

    const digitalScorer = data.digital_scorer_code ?? data.digitalScorerCode ?? data.digital_scorer_id ?? data.digitalScorer ?? null;
    const referee1 = data.referee_1_code ?? data.referee1Code ?? data.referee_1_id ?? data.referee1 ?? null;
    const referee2 = data.referee_2_code ?? data.referee2Code ?? data.referee2 ?? null;

    return {
      tournament_code: data.tournament_code || data.tournamentId || null,
      match_date: data.match_date || data.matchDate,
      match_time: data.match_time || data.match_time,
      court_no: String(data.court_no || data.courtNo || ''),
      match_no: String(data.match_no || data.matchNo || ''),
      age_category: data.age_category || data.ageCategory,
      gender: data.gender,

      white_team: data.white_team || data.whiteTeam || '',
      blue_team: data.blue_team || data.blueTeam || '',

      white_team_code: whiteTeamCode ? String(whiteTeamCode) : null,
      blue_team_code: blueTeamCode ? String(blueTeamCode) : null,

      digital_scorer_code: digitalScorer ? String(digitalScorer) : null,
      referee_1_code: referee1 ? String(referee1) : null,
      referee_2_code: referee2 ? String(referee2) : null,
      
      goaljudge_1_code: data.goaljudge_1_code || data.goaljudge1Code || null,
      goaljudge_2_code: data.goaljudge_2_code || data.goaljudge2Code || null,
      timekeeper_1_code: data.timekeeper_1_code || data.timekeeper1Code || null,
      timekeeper_2_code: data.timekeeper_2_code || data.timekeeper2Code || null,
      // Pass along status directly if supplied in custom forms
      is_complete: data.is_complete ?? false,
    };
  }
}

export default new MatchService();

export interface Match {
  id: number;
  match_date: string;
  match_time: string;
  court_no: string;
  match_no: string;
  age_category: string;
  gender: string;
  tournament_code: string | null;
  white_team: string;
  blue_team: string;
  white_team_code: string | null; 
  blue_team_code: string | null;   
  digital_scorer_code: string | null;
  referee_1_code: string | null;
  referee_2_code: string | null;
  
  goaljudge_1_code: string | null;
  goaljudge_2_code: string | null;
  timekeeper_1_code: string | null;
  timekeeper_2_code: string | null;
  
  is_active: boolean;
  // 🌟 NEW INTERFACE PROPERTY
  is_complete: boolean;
}