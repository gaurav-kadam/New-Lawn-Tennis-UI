import ApiService from '../api/api.service';

class OfficialService {
  async getOfficials() {
    return ApiService.get('/officials');
  }

  async createOfficial(data: any) {
    const payload = this.mapToBackend(data);
    return ApiService.post('/officials', payload);
  }

  async updateOfficial(id: number, data: any) {
    const payload = this.mapToBackend(data);
    return ApiService.put(`/officials/${id}`, payload);
  }

  async deleteOfficial(id: number) {
    return ApiService.delete(`/officials/${id}`);
  }

  // Helper to map React camelCase to FastAPI snake_case
  private mapToBackend(data: any) {
    return {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_no: data.phoneNo,
      gender: data.gender,
      state: data.state,
      city: data.city,
      dob: data.dob
    };
  }
}

export default new OfficialService();