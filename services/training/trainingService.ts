import api from '@/services/api';
import {
  ApiResponse,
  CreateProgramData,
  TrainingProgram,
  TrainingDay,
  TrainingContent,
  UpdateProgramData,
} from '@/interfaces/Training/Training';
import { API_TRAININGS } from '@/utils/Endpoints';

// gestion de programas de formación
export const createProgram = async (
  data: CreateProgramData,
  token: string,
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
  token: string,
): Promise<TrainingProgram[]> => {
  try {
    const response = await api.get<ApiResponse<TrainingProgram[]>>(
      `${API_TRAININGS}/programs/supervisor/${supervisorId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};

export const getProgramById = async (
  programId: number,
  token: string,
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
  token: string,
): Promise<{ success: boolean; data: string }> => {
  try {
    const response = await api.put(
      `${API_TRAININGS}/programs/${programId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProgram = async (
  programId: number,
  token: string,
): Promise<{ success: boolean; data: string }> => {
  try {
    const response = await api.delete(
      `${API_TRAININGS}/programs/${programId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ======================= GESTIÓN DE DÍAS DE FORMACIÓN =========================

export const getTrainingDaysByProgram = async (
  programId: number,
  token: string,
): Promise<TrainingDay[]> => {
  try {
    const response = await api.get<ApiResponse<TrainingDay[]>>(
      `${API_TRAININGS}/programs/${programId}/days`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};

export const createTrainingDay = async (
  programId: number,
  data: { title: string },
  token: string,
): Promise<{ success: boolean; data: string }> => {
  try {
    const response = await api.post(
      `${API_TRAININGS}/programs/${programId}/days`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error creating training day:', error);
    throw error;
  }
};

export const updateTrainingDay = async (
  programId: number,
  dayId: number,
  data: { title: string },
  token: string,
): Promise<void> => {
  try {
    /*
    await api.patch(
      `${API_TRAININGS}/programs/${programId}/days/${dayId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );*/
    const update = await api.patch(
      `${API_TRAININGS}/programs/${programId}/days/${dayId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return update.data;
  } catch (error) {
    console.error('Error updating training day:', error);
    throw error;
  }
};

export const deleteTrainingDay = async (
  programId: number,
  dayId: number,
  token: string,
): Promise<{ success: boolean; data: string }> => {
  try {
    const response = await api.delete(
      `${API_TRAININGS}/programs/${programId}/days/${dayId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ======================= GESTIÓN DE CONTENIDOS DE FORMACIÓN ========================

export const getTrainingContentsByDay = async (
  dayId: number,
  token: string,
): Promise<TrainingContent[]> => {
  try {
    const response = await api.get<ApiResponse<TrainingContent[]>>(
      `${API_TRAININGS}/days/${dayId}/contents`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};

export const deleteTrainingContentsById = async (
  dayId: number,
  contentId: number,
  token: string,
): Promise<{ success: boolean; data: string }> => {
  try {
    const response = await api.delete(
      `${API_TRAININGS}/days/${dayId}/contents/${contentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadTrainingContent = async (
  dayId: number,
  formData: FormData,
  token: string,
): Promise<{ success: boolean; data: string }> => {
  try {
    const response = await api.post(
      `${API_TRAININGS}/days/${dayId}/contents`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
