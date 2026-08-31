import ApiService from '../api/api.service';

import {
  PlayerCreatePayload,
  PlayerUpdatePayload,
} from './player.type';

class PlayerService {

  async getPlayers(
    page = 1,
    pageSize = 100,
    isActive?: boolean
  ) {
    let url =
      `/players?page=${page}&page_size=${pageSize}`;

    if (isActive !== undefined) {
      url += `&is_active=${isActive}`;
    }

    return ApiService.get(url);
  }

  async getPlayerById(id: number) {
    return ApiService.get(`/players/${id}`);
  }

  async createPlayer(
    payload: PlayerCreatePayload
  ) {
    return ApiService.post(
      '/players',
      payload
    );
  }

  async updatePlayer(
    id: number,
    payload: PlayerUpdatePayload
  ) {
    return ApiService.put(
      `/players/${id}`,
      payload
    );
  }

  async deletePlayer(id: number) {
    return ApiService.delete(
      `/players/${id}`
    );
  }

  async restorePlayer(id: number) {
    return ApiService.post(
      `/players/${id}/restore`,
      {}
    );
  }

  /*
   * Kept for the existing match flow.
   * Do not remove this yet.
   */
  async getPlayersByTeamCode(
    teamCode: string
  ) {
    return ApiService.get(
      `/teams/code/${teamCode}/players`
    );
  }
}

export default new PlayerService();