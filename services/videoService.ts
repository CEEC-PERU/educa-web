import axios from './axios';
import { API_VIDEOS } from '../utils/Endpoints';

export const uploadVideo = async (videoFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append('video', videoFile);

  const response = await axios.post<{ url: string }>(`${API_VIDEOS}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.url;
};
