import axios from 'axios';
import { environment } from '../../environment/environment';
import { setupInterceptors } from './interceptor';

const api = axios.create({
  baseURL: environment.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(api);

class ApiService {

  async get(url: string, params?: Record<string, any>) {
    const response = await api.get(url, { params });
    return response.data;
  }

  async post(url: string, data: any, config?: any) {
    const response = await api.post(url, data, config);
    return response.data;
  }

  async put(url: string, data: any) {
    const response = await api.put(url, data);
    return response.data;
  }

  async delete(url: string) {
    const response = await api.delete(url);
    return response.data;
  }
}

export default new ApiService();
