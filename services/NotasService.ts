import axios from 'axios';
import { API_GET_NOTAS, API_GET_NOTAS_USER_ID } from '../utils/Endpoints';
import { UserNota} from '../interfaces/Nota';


export const getCourseNota = async (userToken: string , enterprise_id : number , courseId: number): Promise<UserNota| null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get<UserNota>(`${API_GET_NOTAS}/${enterprise_id}/${courseId}`, config);
    if (response.data) {
      return response.data; 
    } else {
      console.warn('No enterprise found for user:', courseId);
      return null; 
    }
  } catch (error) {
    console.error('Error getting enterprise:', error);
    throw new Error('Error getting enterprise');
  }
};


export const getCourseNotaUserId = async (userToken: string , enterprise_id : number , courseId: number , userId: number): Promise<UserNota| null> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await axios.get<UserNota>(`${API_GET_NOTAS_USER_ID}/${enterprise_id}/${courseId}/user/${userId}`, config);
    if (response.data) {
      return response.data; 
    } else {
      console.warn('No enterprise found for user:', courseId);
      return null; 
    }
  } catch (error) {
    console.error('Error getting enterprise:', error);
    throw new Error('Error getting enterprise');
  }
};