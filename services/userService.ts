// services/userService.ts
import axios from './axios';
import { API_USERS, API_USER, API_GET_USERS_BY_ENTERPRISE} from '../utils/Endpoints';

interface ImportUsersResponse {
  success: boolean;
  message: string;
}

export const createIndividualUser = async (userData: any) => {
  const response = await axios.post(`${API_USER}/create`, userData);
  return response.data;
};

export const importUsers = async (formData: FormData): Promise<ImportUsersResponse> => {
  const response = await axios.post<ImportUsersResponse>(API_USERS, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getUsersByEnterprise = async (enterpriseId: number) => {
  const response = await axios.get(`${API_GET_USERS_BY_ENTERPRISE}/${enterpriseId}`);
  return response.data;
};

export const getRoles = async () => {
  const response = await axios.get(`${API_USER}/roles`);
  return response.data;
};

export const getUsersByRole = async (roleId: string) => {
  const response = await axios.get(`${API_USER}/users/role/${roleId}`);
  return response.data;
};

export const getCompanies = async () => {
  const response = await axios.get(`${API_USER}/companies`);
  return response.data;
};

export const getUsersByCompanyAndRole = async (companyId: number, roleId: number) => {
  const response = await axios.get(`${API_USER}/users/company/${companyId}/role/${roleId}`);
  return response.data;
};