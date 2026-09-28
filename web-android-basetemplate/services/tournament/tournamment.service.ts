import ApiService from '../api/api.service';

class TournamentService {

  async getTournaments(params?: Record<string, any>) {
    return ApiService.get('/tournaments', params);
  }

  async getTournamentById(id: number) {
    return ApiService.get(`/tournament/${id}`);
  }

  async createTournament(payload: any) {
    return ApiService.post('/tournament', payload);
  }

  async updateTournament(id: number, payload: any) {
    return ApiService.put(`/tournament/${id}`, payload);
  }

  async deleteTournament(id: number) {
    return ApiService.delete(`/tournament/${id}`);
  }
}

export default new TournamentService();