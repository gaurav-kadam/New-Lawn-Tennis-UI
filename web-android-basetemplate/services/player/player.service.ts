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
    return ApiService.get(`/player/${id}`);
  }

  async createPlayer(
    payload: PlayerCreatePayload
  ) {
    return ApiService.post(
      '/player',
      payload
    );
  }

  async updatePlayer(
    id: number,
    payload: PlayerUpdatePayload
  ) {
    return ApiService.put(
      `/player/${id}`,
      payload
    );
  }

  async deletePlayer(id: number) {
    return ApiService.delete(
      `/player/${id}`
    );
  }

  async restorePlayer(id: number) {
    return ApiService.post(
      `/player/${id}/restore`,
      {}
    );
  }

}

export default new PlayerService();