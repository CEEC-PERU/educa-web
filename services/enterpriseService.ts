// services/enterpriseService.ts
import axios from './axios';
import { Enterprise } from '../interfaces/Enterprise';
import { API_GET_EMPRESA } from '../utils/Endpoints';

export const getEnterprises = async (): Promise<Enterprise[]> => {
  const response = await axios.get<Enterprise[]>(API_GET_EMPRESA);
  return response.data;
};
