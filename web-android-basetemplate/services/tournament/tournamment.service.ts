import ApiService from '../api/api.service';

class TournamentService {

  async getTournaments() {
    return ApiService.get('/tournaments');
  }

  async getTournamentById(id: number) {
    return ApiService.get(`/tournaments/${id}`);
  }

  async createTournament(payload: any) {
    return ApiService.post('/tournaments', payload);
  }

  async updateTournament(id: number, payload: any) {
    return ApiService.put(`/tournaments/${id}`, payload);
  }

  async deleteTournament(id: number) {
    return ApiService.delete(`/tournaments/${id}`);
  }
}

export default new TournamentService();