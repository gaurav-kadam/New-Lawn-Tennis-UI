import AsyncStorage from '@react-native-async-storage/async-storage';

import ApiService from '../api/api.service';

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

    await AsyncStorage.removeItem('access_token');

    await AsyncStorage.removeItem('user');
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

    return !!token;
  }
}

export default new AuthService();