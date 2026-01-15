import {
  TrainingCreateFormData,
  TrainingProgram,
} from '../../interfaces/Training/Training';
import { API_TRAININGS } from '../../utils/Endpoints';
import axios from 'axios';

export const getAllTrainings = async (): Promise<TrainingProgram[]> => {
  try {
    const response = await axios.get<TrainingProgram[]>(API_TRAININGS);
    return response.data;
  } catch (e) {
    throw e;
  }
};

export const getTrainingById = async (id: number): Promise<TrainingProgram> => {
  try {
    const response = await axios.get<TrainingProgram>(`${API_TRAININGS}/${id}`);
    return response.data;
  } catch (e) {
    throw e;
  }
};

export const createProgramTraining = async (
  data: TrainingCreateFormData
): Promise<TrainingProgram> => {
  try {
    const response = await axios.post<TrainingProgram>(API_TRAININGS, data);
    return response.data;
  } catch (e) {
    throw e;
  }
};
