import { API_AUTH, API_CHANGE_PASSWORD } from "../utils/Endpoints";
import { AxiosError } from "axios";
import api from "../services/api";
import { LoginResponse, LoginRequest } from "../interfaces/User/UserInterfaces";
import { http } from "../lib/http/client";

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  const response = await http.put(API_CHANGE_PASSWORD, {
    currentPassword,
    newPassword,
  });
  return response.data;
};

export const signin = async ({
  dni,
  password,
}: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post(API_AUTH, { dni, password });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<LoginResponse>;
    if (axiosError.response?.status === 401) {
      return axiosError.response.data;
    }
    console.error("Error in login Service:", error);
    throw error;
  }
};
