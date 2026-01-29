import api from '@/services/api';
import {
  MyProgramApiResponse,
  MyProgram,
  MyProgramDetails,
  MyContentDetails,
} from '@/interfaces/Training/Training';
import { API_TRAININGS_STUDENT } from '@/utils/Endpoints';

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
