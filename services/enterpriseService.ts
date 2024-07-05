// services/enterpriseService.ts
import axios from './axios';
import { Enterprise } from '../interfaces/Enterprise';
import { API_GET_ENTERPRISE } from '../utils/Endpoints';

export const getEnterprises = async (): Promise<Enterprise[]> => {
  const response = await axios.get<Enterprise[]>(API_GET_ENTERPRISE);
  return response.data;
};

export const getEnterprise = async (id: number): Promise<Enterprise> => {
  const response = await axios.get<Enterprise>(`${API_GET_ENTERPRISE}/${id}`);
  return response.data;
};

export const addEnterprise = async (enterprise: Omit<Enterprise, 'enterprise_id' | 'created_at' | 'updated_at'>): Promise<void> => {
  await axios.post(API_GET_ENTERPRISE, enterprise);
};

export const updateEnterprise = async (id: number, enterprise: Omit<Enterprise, 'enterprise_id' | 'created_at' | 'updated_at'>): Promise<void> => {
  await axios.put(`${API_GET_ENTERPRISE}/${id}`, enterprise);
};

export const deleteEnterprise = async (id: number): Promise<void> => {
  await axios.delete(`${API_GET_ENTERPRISE}/${id}`);
};
