import axios from 'axios';
import { UserInfoData } from '../interfaces/UserInfo';
import { API_USER_INFO } from '../utils/Endpoints';

export const createUserInfo = async (data: UserInfoData) => {
    const formData = new FormData();
    
    formData.append('user_id', String(data.user_id)); 
    // Adjuntar los archivos al FormData
    formData.append('foto_image', data.foto_image);
    formData.append('firma_image', data.firma_image);
    formData.append('documento_pdf', data.documento_pdf);
  
    try {
      const response = await axios.post(API_USER_INFO, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creando la información del usuario:', error);
      throw error;
    }
};
