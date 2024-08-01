import axios from './axios';
import { API_IMAGES } from '../utils/Endpoints';

export const uploadImage = async (file: File, folder: string): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  const response = await axios.post(`${API_IMAGES}/uploadImage`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.url;
};
