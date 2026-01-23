import api from '@/services/api';
import {
  MyProgramApiResponse,
  MyProgramsResponse,
} from '@/interfaces/Training/Training';
import { API_TRAININGS_STUDENT } from '@/utils/Endpoints';

export const getMyPrograms = async (
  studentId: number,
  token: string,
): Promise<MyProgramsResponse[]> => {
  try {
    const response = await api.get<MyProgramApiResponse>(
      `${API_TRAININGS_STUDENT}/programs/student/${studentId}`,
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
