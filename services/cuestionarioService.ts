import axios from './axios';
import {  API_USER_CUESTIONARIO} from '../utils/Endpoints';
import { RequestCuestionario , ResponseCuestionario} from '../interfaces/Cuestionario';

export const getCuestionarioByUser = async ( course_id :number , user_id :number,cuestype_id :number ): Promise<ResponseCuestionario| null> => {
  try { 
   
    const response = await axios.get<ResponseCuestionario>(`${API_USER_CUESTIONARIO}/search/${course_id}/${user_id}/${cuestype_id}`);
    if (response.data) {
      return response.data; 
    } else {
      console.warn('No enterprise found for user:', course_id);
      return null; 
    }
  } catch (error) {
    console.error('Error getting enterprise:', error);
    throw new Error('Error getting enterprise');
  }
};

export const createCuestionario = async (cuestionarioData: RequestCuestionario): Promise<void> => {
  await axios.post(`${API_USER_CUESTIONARIO}`, cuestionarioData);
};