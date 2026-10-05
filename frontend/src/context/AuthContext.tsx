import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SignUpRequest, LoginRequest } from '../types';
import { 
  getStoredToken, 
  getStoredUser, 
  clearStoredSession, 
  signUpApi, 
  loginApi, 
  getProfileApi 
} from '../services/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (data: SignUpRequest) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore and validate session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = getStoredToken();
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getProfileApi(savedToken);
        setUser(currentUser);
        setToken(savedToken);
      } catch (err) {
        console.warn('Session verification failed, clearing stale session.', err);
        clearStoredSession();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signup = async (data: SignUpRequest) => {
    const res = await signUpApi(data);
    setToken(res.token);
    setUser(res.user);
  };

  const login = async (data: LoginRequest) => {
    const res = await loginApi(data);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    clearStoredSession();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        signup,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
