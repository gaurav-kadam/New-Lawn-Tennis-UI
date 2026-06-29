import ApiService from '../api/api.service';

class LogService {

  async getLogs(matchId?: number) {
  // If matchId is provided, append the query parameter
  const url = matchId ? `/log?match_id=${matchId}` : '/log';
  return ApiService.get(url);
}

  async getLogById(id: number) {
    return ApiService.get(`/log/${id}`);
  }

  
  async bulkCreateLogs(logs: any[]) {
    // payload should match { logs: [...] } as defined in your backend schema
    return ApiService.post('/log/bulk', { logs });
  }

  // Keep existing single-log methods if you still need them for specific use cases,
  // but remove calls to these from your MatchContext add/update/delete actions.
  async createLog(payload: any) { return ApiService.post('/log', payload); }
  async updateLog(id: number, payload: any) { return ApiService.put(`/log/${id}`, payload); }
  async deleteLog(id: number) { return ApiService.delete(`/log/${id}`); }
}


export default new LogService();