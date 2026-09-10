import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AuthService from '../services/auth/auth.service';
import { getSessionRevision, onSessionInvalidated } from '../services/auth/auth-session';

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
  const generation = useRef(0);

  useEffect(() => {
    let active = true;
    const current = ++generation.current;
    const unsubscribe = onSessionInvalidated(() => {
      generation.current += 1;
      setUser(null);
      setIsLoggedIn(false);
      setLoading(false);
    });
    void (async () => {
      try {
        const authenticated = await AuthService.isAuthenticated();
        const userData: unknown = authenticated ? await AuthService.getUser() : null;
        if (!active || current !== generation.current) return;
        if (authenticated && isLoggedInUser(userData)) {
          setUser(userData);
          setIsLoggedIn(true);
        } else {
          await AuthService.logout();
        }
      } catch {
        if (active && current === generation.current) {
          setUser(null);
          setIsLoggedIn(false);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; unsubscribe(); };
  }, []);

  const login = async (email: string, password: string) => {
    const current = ++generation.current;
    const revision = getSessionRevision();
    const data = await AuthService.login(email, password);
    if (current !== generation.current || revision !== getSessionRevision()) {
      await AuthService.logout();
      throw new Error('Session changed during login. Please try again.');
    }
    if (!isLoggedInUser(data.user)) {
      await AuthService.logout();
      throw new Error('Invalid session');
    }
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

function isLoggedInUser(value: unknown): value is LoggedInUser {
  if (!(typeof value === 'object' && value !== null &&
    'name' in value && typeof value.name === 'string' &&
    'email' in value && typeof value.email === 'string')) return false;
  if (!('role' in value) || value.role === undefined) return true;
  return typeof value.role === 'object' && value.role !== null &&
    'role_name' in value.role && typeof value.role.role_name === 'string' &&
    'is_active' in value.role && typeof value.role.is_active === 'boolean';
}
