import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthService from '../services/auth/auth.service';

// Define explicit user scheme structure matches your backend storage
interface LoggedInUser {
  name: string;
  email: string;
  role?: {
    role_name: string; // 'supervisor' | 'admin' | 'scorer'
    is_active: boolean;
  };
}

type AuthContextType = {
  isLoggedIn: boolean;
  loading: boolean;
  user: LoggedInUser | null; // Added global user visibility profile
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await AuthService.isAuthenticated();
      setIsLoggedIn(authenticated);
      
      if (authenticated) {
        const userData = await AuthService.getUser();
        setUser(userData);
      }
    } catch (err) {
      console.log('Error verifying initial auth profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const data = await AuthService.login(email, password);
    // Explicitly grab user payload returned from backend response signature
    setUser(data.user); 
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}