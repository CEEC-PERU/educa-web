
import api from './api';

interface LoginResponse {
  token: string;
}

export const loginService = async (dni: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/login', { dni, password });
  return response.data;
};
