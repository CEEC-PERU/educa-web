import axios from './axios';
import { Professor, Level } from '../interfaces/Professor';
import { API_PROFESSORS, API_LEVELS } from '../utils/Endpoints';

export const getProfessors = async (): Promise<Professor[]> => {
    const response = await axios.get<Professor[]>(API_PROFESSORS);
    return response.data;
};

export const addProfessor = async (professor: Omit<Professor, 'professor_id' | 'created_at' | 'updated_at'>, imageFile: File): Promise<Professor> => {
  const formData = new FormData();

  // Agrega los datos del profesor al FormData
  for (const key in professor) {
      formData.append(key, (professor as any)[key]);
  }

  // Agrega la imagen al FormData
  formData.append('image', imageFile);

  const response = await axios.post(API_PROFESSORS, formData, {
      headers: {
          'Content-Type': 'multipart/form-data',
      },
  });

  return response.data;
};

export const getProfessor = async (professor_id: number): Promise<Professor> => {
  const response = await axios.get<Professor>(`${API_PROFESSORS}/${professor_id}`);
  return response.data;
};

export const deleteProfessor = async (professor_id: number): Promise<void> => {
    try {
        const response = await axios.delete(`${API_PROFESSORS}/${professor_id}`);
        return response.data;
    } catch (error: any) {  // Especifica el tipo de error como `any`
        throw new Error(error.response?.data?.error || 'Error eliminando profesor');
    }
};
  export const updateProfessor = async (professor_id: number, professor: Omit<Professor, 'professor_id' | 'created_at' | 'updated_at'>, imageFile?: File): Promise<void> => {
    const formData = new FormData();

    // Agrega los datos del profesor al FormData
    for (const key in professor) {
        formData.append(key, (professor as any)[key]);
    }

    // Si hay una nueva imagen, la agrega al FormData
    if (imageFile) {
        formData.append('image', imageFile);
    }

    await axios.put(`${API_PROFESSORS}/${professor_id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getLevels = async (): Promise<Level[]> => {
  const response = await axios.get<Level[]>(API_LEVELS);
  return response.data;
};
