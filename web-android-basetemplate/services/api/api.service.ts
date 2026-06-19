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

  async get(url: string) {
    const response = await api.get(url);
    return response.data;
  }

  async post(url: string, data: any) {
    const response = await api.post(url, data);
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