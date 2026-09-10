import AsyncStorage from '@react-native-async-storage/async-storage';

import ApiService from '../api/api.service';
import { toByteArray } from 'base64-js';
import { invalidateSession } from './auth-session';

class AuthService {

  async login(email: string, password: string) {

    const response = await ApiService.post(
      '/auth/login',
      {
        email,
        password,
      }
    );

    // backend response
    // response.data.access_token
    // response.data.user

    const token = response.data.access_token;

    const user = response.data.user;

    // save in storage

    await AsyncStorage.setItem(
      'access_token',
      token
    );

    await AsyncStorage.setItem(
      'user',
      JSON.stringify(user)
    );

    return response.data;
  }

  async logout() {
    await invalidateSession();
  }

  async getToken() {

    return AsyncStorage.getItem('access_token');
  }

  async getUser() {

    const user = await AsyncStorage.getItem('user');

    return user ? JSON.parse(user) : null;
  }

  async isAuthenticated() {

    const token = await this.getToken();

    if (!token) return false;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
      const payload: unknown = JSON.parse(String.fromCharCode(...toByteArray(padded)));
      return typeof payload === 'object' && payload !== null &&
        'exp' in payload && typeof payload.exp === 'number' &&
        payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}

export default new AuthService();
