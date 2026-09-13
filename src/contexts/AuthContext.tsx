import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '@/services/api';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: boolean;
}

interface AuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get<{ status: string; user: AdminUser }>('/auth/me');
      if (response && response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (_) {
      setUser(null);
      localStorage.removeItem('portfolio_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    const data = await api.post<{ status: string; user: AdminUser; token?: string }>('/auth/login', {
      email,
      password,
    });

    if (data?.token) {
      localStorage.setItem('portfolio_token', data.token);
    }

    if (data?.user) {
      setUser(data.user);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (_) {
      // continua com logout local mesmo se a chamada de rede falhar
    } finally {
      localStorage.removeItem('portfolio_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
