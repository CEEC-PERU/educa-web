import { API_AUTH } from '../utils/Endpoints';
import axios from 'axios';
import { User } from '../interfaces/Auth';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const signin = async (dni: string, password: string) => {
  const response = await api.post(API_AUTH, { dni, password });
  const { token } = response.data;
  localStorage.setItem('token', token);
  const decoded = jwtDecode<User>(token);
  api.defaults.headers.Authorization = `Bearer ${token}`;
  return decoded;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};
