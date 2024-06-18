import { API_AUTH } from '../utils/Endpoints';
import axios, { AxiosError } from 'axios';
import api from '../services/api';
import { LoginResponse, LoginRequest } from "../interfaces/UserInterfaces";

export const signin = async ({ dni, password }: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post(API_AUTH, { dni, password });
    return response.data;;
  } catch (error) {
    const axiosError = error as AxiosError<LoginResponse>
    if (axiosError.response?.status === 401) {
        return axiosError.response.data;
    }
    console.error("Error in login Service:", error);
    throw error
  }
};
