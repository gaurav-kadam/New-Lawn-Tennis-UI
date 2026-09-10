import ApiService from '../api/api.service';

class OfficialService {
  async getOfficials(params?: Record<string, any>) {
    return ApiService.get('/officials', params);
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
    const officialName =
      data.official_name ||
      data.officialName ||
      [data.firstName, data.lastName]
        .filter((part: unknown) => typeof part === 'string' && part.trim())
        .map((part: string) => part.trim())
        .join(' ');

    return {
      official_name: officialName,
      role_title: data.roleTitle || data.role_title || 'Official',
      email: data.email,
      mobile: data.mobile || data.phoneNo,
      gender: data.gender,
      state: data.state,
      city: data.city,
      date_of_birth: data.dateOfBirth || data.date_of_birth || data.dob,
    };
  }
}

export default new OfficialService();
