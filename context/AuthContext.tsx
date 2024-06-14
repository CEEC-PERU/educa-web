//validar al usuario que inicio sesion , que no tenga perfil
import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import {jwtDecode} from 'jwt-decode'; // Corrige la importación de jwtDecode
import api from '../services/api';
import { getProfile } from "../services/profile";
import { removeToken, signin, getToken } from '../services/authService';
import { AuthContextData, AuthProviderProps, User } from '../interfaces/Auth'; 

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [profileInfo, setProfileInfo] = useState<any>(null); 

  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const storedToken = getToken();
      if (storedToken) {
        try {
          const decoded = jwtDecode<User>(storedToken);
          setUser(decoded);
          setToken(storedToken);
          api.defaults.headers.Authorization = `Bearer ${storedToken}`;
          
          // Obtener perfil del usuario
          const profile = await getProfile(storedToken, decoded.id); 
          if (profile) {
            setProfileInfo(profile);
            localStorage.setItem('profileInfo', JSON.stringify(profile));
            redirectToDashboard(decoded.role);
          } else {
            redirectToProfile(decoded.role);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          logout();
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (dni: string, password: string) => {
    setIsLoading(true);
    try {
      const decoded = await signin(dni, password);
      const storedToken = getToken();
      setUser(decoded);
      setToken(storedToken);

      if (!storedToken || !decoded) {
        throw new Error('Token or user data is null');
      }

      api.defaults.headers.Authorization = `Bearer ${storedToken}`;

      // Obtener perfil del usuario después de iniciar sesión
      const profile = await getProfile(storedToken, decoded.id); 
      if (profile) {
        setProfileInfo(profile);
        localStorage.setItem('profileInfo', JSON.stringify(profile));
      }

      // Redireccionar según el rol y la existencia de perfil
      if (profile) {
        router.push('/profile');
      } else {
        redirectToDashboard(decoded.role);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profileInfo');
    removeToken();
    setUser(null);
    setToken(null);
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

  const redirectToProfile = (role: number) => {
    switch (role) {
      case 1:
        router.push('/student/profile');
        break;
      case 2:
        router.push('/corporate/profile');
        break;
      case 3:
        router.push('/content/profile');
        break;
      case 4:
        router.push('/admin/profile');
        break;
      default:
        router.push('/');
    }
  };

  const value = useMemo(() => ({
    user,
    token,
    isLoading,
    error,
    login,
    logout,
    redirectToDashboard,
  }), [user, token, isLoading, error]);

  return (
    <AuthContext.Provider value={value}>
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
