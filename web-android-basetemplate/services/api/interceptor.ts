import AsyncStorage
from '@react-native-async-storage/async-storage';

import LoaderService
from '../loader/loader.service';

export const setupInterceptors = (
  api: any
) => {

  // ================= REQUEST =================

  api.interceptors.request.use(

    async (config: any) => {

      // GLOBAL LOADER START
      LoaderService.showLoader();

      const token =
        await AsyncStorage.getItem(
          'access_token'
        );

      if (token) {

        config.headers.Authorization =
          `Bearer ${token}`;
      }

      if (
        typeof FormData !== 'undefined' &&
        config.data instanceof FormData
      ) {
        if (typeof config.headers?.delete === 'function') {
          config.headers.delete('Content-Type');
          config.headers.delete('content-type');
        } else {
          delete config.headers?.['Content-Type'];
          delete config.headers?.['content-type'];
        }
      }

      return config;
    },

    (error: any) => {

      LoaderService.hideLoader();

      return Promise.reject(error);
    }
  );

  // ================= RESPONSE =================

  api.interceptors.response.use(

    (response: any) => {

      // GLOBAL LOADER STOP
      LoaderService.hideLoader();

      return response;
    },

    async (error: any) => {

      // GLOBAL LOADER STOP
      LoaderService.hideLoader();

      // ================= AUTO LOGOUT =================

      if (
        error.response?.status === 401
      ) {

        await AsyncStorage.removeItem(
          'access_token'
        );

        await AsyncStorage.removeItem(
          'user'
        );
      }

      return Promise.reject(error);
    }
  );
};
