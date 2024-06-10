import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import { User, AuthProviderProps, AuthContextData } from '../interfaces/Auth';
import { signin } from '../services/authService';

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
        api.defaults.headers.Authorization = `Bearer ${token}`;
        redirectToDashboard(decoded.role);
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
      }
    }
  }, []);

  const login = async (dni: string, password: string) => {
    try {
      const decoded = await signin(dni, password);
      setUser(decoded);
      redirectToDashboard(decoded.role);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error; // Re-throw the error to be caught by the component
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  const redirectToDashboard = (role: number) => {
    switch (role) {
      case 1:
        router.push('/student');
        break;
      case 2:
        router.push('/corporate');
        break;
      case 3:
        router.push('/content');
        break;
      case 4:
        router.push('/admin');
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
