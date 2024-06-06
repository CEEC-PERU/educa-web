// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from "jwt-decode";
import api from '../services/api';

interface AuthContextData {
  user: User | null;
  login: (dni: string, password: string) => Promise<void>;
  logout: () => void;
}

interface User {
  id: number;
  role: number;
  dni: string;
  enterprise_id: number;
  loginTime: string;
  iat: number;
  exp: number;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<User>(token);
      setUser(decoded);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      redirectToDashboard(decoded.role);
    }
  }, []);

  const login = async (dni: string, password: string) => {
    const response = await api.post('/login', { dni, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    const decoded = jwtDecode<User>(token);
    setUser(decoded);
    api.defaults.headers.Authorization = `Bearer ${token}`;
    redirectToDashboard(decoded.role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/auth/login');
  };

  const redirectToDashboard = (role: number) => {
    switch (role) {
      case 1:
        router.push('/admin');
        break;
      case 2:
        router.push('/student');
        break;
      case 3:
        router.push('/content');
        break;
      case 4:
        router.push('/corporate');
        break;
      default:
        router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
