import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import {jwtDecode  }from 'jwt-decode'; // Importación corregida de jwtDecode
import axios from "axios";
import { getProfile } from "../services/profile";
import { signin } from '../services/authService';
import { AuthContextData, AuthProviderProps } from '../interfaces/Auth'; 
import { LoginResponse, Profile, UserInfo } from '../interfaces/UserInterfaces';
import { validateToken } from "../helpers/helper-token";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<{
    id: number;
    role: number;
    dni: string;
    enterprise_id: number;
  } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [profileInfo, setProfileInfo] = useState<Profile | UserInfo | null>(null);
  const router = useRouter();

  const login = async (dni: string, password: string) => {
    setIsLoading(true);
    try {
      const response: LoginResponse = await signin({ dni, password });
      if (response.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        const decodedToken: { id: number; role: number; dni: string; enterprise_id: number } = jwtDecode(response.token);
        setToken(response.token);
        setUser({ id: decodedToken.id, role: decodedToken.role, dni: decodedToken.dni, enterprise_id: decodedToken.enterprise_id });

        localStorage.setItem('userToken', response.token);
        localStorage.setItem('userInfo', JSON.stringify({
          id: decodedToken.id,
          role: decodedToken.role,
          dni: decodedToken.dni,
          enterprise_id: decodedToken.enterprise_id,
        }));
        console.log(token)
        console.log(response.token)
        
        const profile = await getProfile(response.token ,decodedToken.id);
        console.log("PROFILE API GET SEARCH",profile)
        if (profile) {
          setProfileInfo(profile);
          localStorage.setItem('profileInfo', JSON.stringify(profile));
          redirectToDashboard(decodedToken.role);
        } else {
          redirectToProfile(decodedToken.role);
        }
      } else {
        setError(response.msg ?? 'Hubo un problema al iniciar sesión. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('profileInfo');

    setUser(null);
    setToken(null);
    router.push('/');
  };

  useEffect(() => {

      try {
        const storedUserToken = localStorage.getItem('userToken');
        const storedUserInfo = localStorage.getItem('userInfo');
        const isValid = storedUserToken ? validateToken(storedUserToken) : false;

        if (storedUserInfo && isValid) {
          const storedProfileInfo = localStorage.getItem('profileInfo');
          if (storedProfileInfo) {
            setProfileInfo(JSON.parse(storedProfileInfo));
          }

          const { id, role, dni, enterprise_id } = JSON.parse(storedUserInfo);
          
          setToken(storedUserToken);
          setUser({ id, role, dni, enterprise_id });
        } else {
          setToken(null);
          setUser(null);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
   
  }, []);

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
    router.push('/profile');
  };

  const value = useMemo(() => ({
    user,
    token,
    isLoading,
    error,
    login,
    logout,
    profileInfo,
    redirectToDashboard,
  }), [user, token, isLoading, error, profileInfo]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
