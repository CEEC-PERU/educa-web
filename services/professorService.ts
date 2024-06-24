import axios from './axios';
import { Professor, Level } from '../interfaces/Professor';
import { API_PROFESSORS, API_LEVELS } from '../utils/Endpoints';

export const getProfessors = async (): Promise<Professor[]> => {
    const response = await axios.get<Professor[]>(API_PROFESSORS);
    return response.data;
};

export const addProfessor = async (professor: Professor): Promise<Professor> => {
    const response = await axios.post(API_PROFESSORS, professor);
    return response.data;
};

export const getProfessor = async (professor_id: number): Promise<Professor> => {
  const response = await axios.get<Professor>(`${API_PROFESSORS}/${professor_id}`);
  return response.data;
};

export const deleteProfessor = async (professor_id: number): Promise<void> => {
    await axios.delete(`${API_PROFESSORS}/${professor_id}`);
  };

export const updateProfessor = async (professor_id: number, professor: Professor): Promise<void> => {
  await axios.put(`${API_PROFESSORS}/${professor_id}`, professor);
};

export const getLevels = async (): Promise<Level[]> => {
  const response = await axios.get<Level[]>(API_LEVELS);
  return response.data;
};
