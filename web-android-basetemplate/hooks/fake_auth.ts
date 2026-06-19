import { useState } from 'react';

let globalAuth = {
  isLoggedIn: false,
};

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(globalAuth.isLoggedIn);

  const login = () => {
    globalAuth.isLoggedIn = true;
    setIsLoggedIn(true);
  };

  const logout = () => {
    globalAuth.isLoggedIn = false;
    setIsLoggedIn(false);
  };

  return { isLoggedIn, login, logout };
}