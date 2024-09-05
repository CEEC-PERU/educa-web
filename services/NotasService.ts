import axios from 'axios';
import { API_GET_NOTAS } from '../utils/Endpoints';
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