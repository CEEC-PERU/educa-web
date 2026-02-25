import api from "@/services/api";
import {
  MyProgramApiResponse,
  MyProgram,
  MyProgramDetails,
  MyContentDetails,
} from "@/interfaces/Training/Training";
import { API_TRAININGS_STUDENT } from "@/utils/Endpoints";

export const getMyPrograms = async (token: string): Promise<MyProgram[]> => {
  try {
    const response = await api.get<MyProgramApiResponse>(
      `${API_TRAININGS_STUDENT}/student/programs`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.data;
  } catch (e) {
    throw e;
  }
};

export const getMyProgramDetails = async (
  programId: number,
  token: string,
): Promise<MyProgramDetails> => {
  try {
    const response = await api.get(
      `${API_TRAININGS_STUDENT}/student/programs/${programId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.data;
  } catch (e) {
    throw e;
  }
};

export const getMyContentDetails = async (
  programId: number,
  dayId: number,
  contentId: number,
  token: string,
): Promise<MyContentDetails> => {
  try {
    const response = await api.get(
      `${API_TRAININGS_STUDENT}/student/programs/${programId}/days/${dayId}/contents/${contentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.data;
  } catch (e) {
    throw e;
  }
};

// iniciar contenido
export const startContent = async (
  programId: number,
  contentId: number,
  dayId: number,
  token: string,
) => {
  const response = await api.post(
    `${API_TRAININGS_STUDENT}/student/programs/${programId}/contents/${contentId}/start`,
    { dayId },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data.data;
};

// Actualizar progreso
export const updateContentProgress = async (
  contentId: number,
  progressData: {
    progress_percentage: number;
    last_position?: number;
    metadata?: any;
  },
  token: string,
) => {
  const response = await api.put(
    `${API_TRAININGS_STUDENT}/student/programs/contents/${contentId}/progress`,
    progressData,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data.data;
};

// Completar contenido
export const completeContent = async (
  contentId: number,
  contentType: string,
  completionData: any,
  token: string,
) => {
  const response = await api.post(
    `${API_TRAININGS_STUDENT}/student/programs/contents/${contentId}/complete`,
    { content_type: contentType, completion_data: completionData },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data.data;
};

// Tracking SCORM
export const trackScormData = async (
  contentId: number,
  scormData: any,
  token: string,
) => {
  const response = await api.post(
    `${API_TRAININGS_STUDENT}/student/programs/contents/${contentId}/scorm`,
    { scorm_data: scormData },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data.data;
};
