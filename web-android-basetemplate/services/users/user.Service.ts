import ApiService from '../api/api.service';

class UserService {

  async getUsers(params?: Record<string, any>) {
    return ApiService.get('/users', params);
  }

  async createUser(payload: any) {
    return ApiService.post('/auth/register/', payload);
  }

  async updateUser(id: number, payload: any) {
    return ApiService.put(`/users/${id}`, payload);
  }

  async deleteUser(id: number) {
    return ApiService.delete(`/users/${id}`);
  }
}

export default new UserService();