//imageService.ts
import axios from './axios';
import { API_IMAGES } from '../utils/Endpoints';

export const uploadImage = async (file: File, context: string): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('context', context); // Pasa el contexto al backend

  const response = await axios.post<{ url: string }>(`${API_IMAGES}/uploadImage`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.url;
};
