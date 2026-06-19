import ApiService from '../api/api.service';

class PlayerService {

  async getPlayers() {
    return ApiService.get('/players/');
  }

  async getPlayerById(id: number) {
    return ApiService.get(`/players/${id}`);
  }

  async createPlayer(data: any) {
    return ApiService.post('/players/', data);
  }

  async updatePlayer(id: number, data: any) {
    return ApiService.put(`/players/${id}`, data);
  }

  async deletePlayer(id: number) {
    return ApiService.delete(`/players/${id}`);
  }
}

export default new PlayerService();