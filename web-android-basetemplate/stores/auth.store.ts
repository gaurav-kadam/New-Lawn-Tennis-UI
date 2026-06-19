import { create } from 'zustand';

interface AuthState {

  isLoggedIn: boolean;

  token: string | null;

  user: any;

  login: (
    token: string,
    user?: any,
  ) => void;

  logout: () => void;
}

export const useAuthStore =
  create<AuthState>((set) => ({

    isLoggedIn: false,

    token: null,

    user: null,

    login: (token, user) =>

      set({
        isLoggedIn: true,
        token,
        user,
      }),

    logout: () =>

      set({
        isLoggedIn: false,
        token: null,
        user: null,
      }),
  }));