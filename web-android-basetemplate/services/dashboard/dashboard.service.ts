import ApiService from '../api/api.service';

class DashboardService {
    
  async getDashboardSummary() {
    return ApiService.get('/dashboard/summary');
  }
}

export default new DashboardService();