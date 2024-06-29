// services/userService.ts
import axios from './axios';
import { API_USERS } from '../utils/Endpoints';

interface ImportUsersResponse {
  success: boolean;
  message: string;
}

export const importUsers = async (formData: FormData): Promise<ImportUsersResponse> => {
  const response = await axios.post<ImportUsersResponse>(API_USERS, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
