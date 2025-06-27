// services/userService.ts
import axios from './../axios';
import {
  API_USERS,
  API_USER,
  API_GET_USERS_BY_ENTERPRISE,
  API_USERCOUNT,
  API_USERS_COURSES,
  API_USERU,
} from '../../utils/Endpoints';
import { UserCount } from '../../interfaces/User/UserCount';
interface ImportUsersResponse {
  success: boolean;
  message: string;
}

export const getUserCount = async (
  userToken: string,
  enterprise_id: number
): Promise<UserCount | null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get<UserCount>(
      `${API_USERCOUNT}/${enterprise_id}`,
      config
    );
    if (response.data) {
      return response.data;
    } else {
      console.warn('No enterprise found for user:', enterprise_id);
      return null;
    }
  } catch (error) {
    console.error('Error getting enterprise:', error);
    throw new Error('Error getting enterprise');
  }
};

export const createIndividualUser = async (userData: any) => {
  const response = await axios.post(`${API_USER}/create`, userData);
  return response.data;
};

export const importUsers = async (
  formData: FormData
): Promise<ImportUsersResponse> => {
  const response = await axios.post<ImportUsersResponse>(API_USERS, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getUsersByEnterprise = async (enterpriseId: number) => {
  const response = await axios.get(
    `${API_GET_USERS_BY_ENTERPRISE}/${enterpriseId}`
  );
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

export const getUsersByCompanyAndRole = async (
  companyId: number,
  roleId: number
) => {
  const response = await axios.get(
    `${API_USER}/users/company/${companyId}/role/${roleId}`
  );
  return response.data;
};

export const getUsersByClassroom = async (
  userId: number,
  companyId: number
) => {
  const response = await axios.get(
    `${API_USER}/classrooms/users/${userId}/company/${companyId}`
  );
  return response.data;
};

export const getUserById = async (userId: number) => {
  const response = await axios.get(`${API_USER}/users/${userId}`);
  return response.data;
};

export const deleteUserById = async (userId: number) => {
  try {
    const response = await axios.delete(`${API_USERU}/users/${userId}`);
    return response.data; // Se puede devolver una respuesta personalizada o un mensaje de éxito
  } catch (error) {
    throw error; // Propagamos el error para que se pueda manejar más tarde
  }
};

export const getCoursesByUser = async (userId: number) => {
  const response = await axios.get(`${API_USERS_COURSES}/${userId}`);
  return response.data;
};

export const updateUser = async (userId: number, userData: any) => {
  const response = await axios.put(`${API_USER}/update/${userId}`, userData);
  return response.data;
};
