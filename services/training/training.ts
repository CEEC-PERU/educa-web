import api from '@/services/api';
import {
  CreateProgramData,
  TrainingProgram,
  UpdateProgramData,
} from '@/interfaces/Training/Training';
import { API_TRAININGS } from '@/utils/Endpoints';

// gestion de programas de formación
export const createProgram = async (
  data: CreateProgramData,
  token: string
): Promise<{ success: boolean; data: string }> => {
  try {
    const response = await api.post(`${API_TRAININGS}/programs`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllProgramsBySupervisor = async (
  supervisorId: number,
  token: string
): Promise<TrainingProgram[] | null> => {
  try {
    const response = await api.get(
      `${API_TRAININGS}/programs/supervisor/${supervisorId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProgramById = async (
  programId: number,
  token: string
): Promise<TrainingProgram | null> => {
  try {
    const response = await api.get(`${API_TRAININGS}/programs/${programId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProgram = async (
  programId: number,
  data: UpdateProgramData,
  token: string
): Promise<{ success: boolean; data: string }> => {
  try {
    const response = await api.put(
      `${API_TRAININGS}/programs/${programId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProgram = async (
  programId: number,
  token: string
): Promise<{ success: boolean; data: string }> => {
  try {
    const response = await api.delete(
      `${API_TRAININGS}/programs/${programId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
